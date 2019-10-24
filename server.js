var express = require("express");
var mongoose = require("mongoose");
var handle = require("express-handlebars");
var db = require("./models");
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/redditscraper"
mongoose.connect(MONGODB_URI);
app.set("views", "./views");
app.engine(
  "handlebars",
  handle({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

require("./routing.js")(app, db);

app.listen(PORT, function() {
    console.log("App running on port http://localhost:" + PORT);
  });
  