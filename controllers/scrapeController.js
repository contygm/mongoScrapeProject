var express = require("express");
var router = express.Router();

var request = require("request");
var cheerio = require("cheerio");

// link models
var Note = require("../models/note.js");
var Article = require("../models/article.js")

//GET request to scrape google news website
router.get("/", function(req, res) {

	request("http://news.google.com/", function(error, response, html){
	
		// getting html data, setting it equal to $ variable
		var $ = cheerio.load(html);
		
		// pull article blocks from news.google
		$("table.esc-layout-table").each(function(i, element){
			
			// empty array for saving article block info
			var result = {};
			// get schema parts .esc-lead-article-title-wrapper
			result.title = $(element).find("h2").find("a").text();
			result.link = $(element).find("h2").find("a").attr('href');

			var entry = new Article(result);

			entry.save(function(err, doc){
				if(err) {
					console.log(err);
				} else {
					console.log(doc);
				}
			});
		})

		res.render("index")
	});
});

//get the articles we scraped from the mongoDB
router.get("/articles", function(req, res){
	Article.find({}, function(err, doc){
		if (err){ 
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

// grab an article by it's ObjectId
router.get("/articles/:id", function(req, res){
	Article.findOne({"_id":req.params.id})
		.populate("note")
		.exec(function(err, doc){
			if (err){
				console.log(err);
			} else {
				res.json(doc);
			}
		});
})


// Create a new note/replace existing note
router.post("/articles/:id", function(req, res){
	var newNote = new Note(req.body);
	newNote.save(function(err, doc){
		if (err){
			res.send(err)
		} else {
			Article.findOneAndUpdate({"_id":req.params.id}, {"note": doc._id})
				.exec(function(err, doc){
					if(err){
						console.log(err);
					} else {
						res.json(doc);
					}
				});
		}
	});
})


module.exports = router;
