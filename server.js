var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

// link models
var Note = require("./models/note.js");
var Article = require("./models/article.js");

// Initialize Express
var app = express();

// Make public a static dir
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
	defaultLayout: "main"
}));

app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/mongoScrapeProject");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// ROUTES SECTION

// TODO: A GET request to scrape google news website
app.get("/", function(req, res) {

  	request("https://news.google.com/", function(error, response, html){
		
		// getting html data, setting it equal to $ variable
		var $ = cheerio.load(html);

		// pull article blocks from news.google
		$("div.blended-wrapper.esc-wrapper").each(function(i, element){
			
			// empty array for saving article block info
			var result = {};

			// get schema parts
			result.title = $(this).children("h2").children("a").attr('text');
			result.link = $(this).children("h2").children("a").attr('href');
			result.source = $(this.al-atribution-source).children("").attr("text");
			result.thumbnail = $(this).children("img").attr("src");
			result.snippet = $(this.esc-lead-snippet-wrapper).children("").attr('text');

			var entry = new Article(result);

			entry.save(function(err, doc){
				if(err) {
					console.log(err);
				} else {
					console.log(doc);
				}
			});
		});	
	});

	res.render("index");
	console.log("scrape complete");
});


// TODO: This will grab an article by it's ObjectId
// TODO: This will get the articles we scraped from the mongoDB
// TODO: Create a new note or replace an existing note

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});