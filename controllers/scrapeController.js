var express = require("express");
var router = express.Router();

var request = require("request");
var cheerio = require("cheerio");

// link models
var Note = require("../models/note.js");
var Article = require("../models/article.js")

// TODO: A GET request to scrape google news website
router.get("/", function(req, res) {
	request("http://news.google.com/", function(error, response, html){
	
		// getting html data, setting it equal to $ variable
		var $ = cheerio.load(html);
		
		// pull article blocks from news.google
		$("table.esc-layout-table").each(function(i, element){
			
			// empty array for saving article block info
			var result = [];
			// get schema parts .esc-lead-article-title-wrapper
			result.title = $(element).find("h2").find("a").text();
			result.link = $(element).find("h2").find("a").attr('href');
			result.source = $(element).find("table").find("span").eq(0).text();
			result.thumbnail = $(element).find("td").find("img").attr("imgsrc");
			result.snippet = $(element).find("td").next().children().attr("class");

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

// TODO: grab an article by it's ObjectId
// TODO: get the articles we scraped from the mongoDB
// TODO: Create a new note/replace existing note

module.exports = router;
