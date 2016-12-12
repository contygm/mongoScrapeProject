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

// Simple index route
app.get("/", function(req, res) {
  res.render("index");
});


// TODO: Create a new note or replace an existing note
app.get("/scrape", function(req, res){
	request("https://news.google.com/", function(error, response, html){
		
		// getting html data, setting it equal to $ variable
		var $ = cheerio.load(html);

		// pull article blocks from news.google
		$("blended-wrapper esc-wrapper").each(function(i, element){
			
			// empty array for saving article block info
			var results = {};


		})

		
	})
})
// TODO: This will grab an article by it's ObjectId
// TODO: This will get the articles we scraped from the mongoDB
// TODO: A GET request to scrape google news website

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});