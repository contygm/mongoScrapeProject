var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Promise = require("bluebird");
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Make public a static dir
app.use(express.static(process.cwd() || __dirname + '/public'));

app.use(bodyParser.urlencoded({
	extended: false
}));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
	defaultLayout: "main"
}));

app.set("view engine", "handlebars");

mongoose.connect("mongodb://heroku_xpmqrqxr:35ubb1vpojmr1k4pr58ds3igm@ds133388.mlab.com:33388/heroku_xpmqrqxr");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
 	console.log("Mongoose connection successful.");
 	db.dropDatabase();
});

// ROUTES SECTION

var routes = require("./controllers/scrapeController.js");
app.use("/", routes);

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});