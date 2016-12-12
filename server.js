var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

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

var routes = require("./controllers/scrapeController.js");
app.use("/", routes);

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});