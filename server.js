var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

// link models
var Note = require("./models/note.js");
var Article = require("./models/article.js");

var Promise = require("bluebird");
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Make public a static dir
app.use(express.static(process.cwd() || __dirname + '/public'));

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

app.get("/", function(req, res) {
	res.render("index")
});

// TODO: A GET request to scrape google news website
app.get("/submit", function(){

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
			result.source = $(element).find("table").find("span").text();
			//result.thumbnail = $(element).find("td").find("img").attr("src");
			result.snippet = $(element).find("tr").children("td.esc-layout-article-cell").children("div.esc-lead-snippet-wrapper").text();

			var entry = new Article(result);

			entry.save(function(err, doc){
				if(err) {
					console.log(err);
				} else {
					console.log(doc);
				}
			});
		});	
	}).then(function(){
		res.redirect("index");
		console.log("scrape complete1");
	});
})

// TODO: grab an article by it's ObjectId
// TODO: get the articles we scraped from the mongoDB
// TODO: Create a new note/replace existing note

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});