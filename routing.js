var axios = require("axios");
var cheerio = require("cheerio");
module.exports = (app, db) => {
    app.get("/", (req, res) => {
        axios.get("https://old.reddit.com/r/all/").then(function (response) {
            var $ = cheerio.load(response.data);
            var results = [];
            $("p.title").each(function(i, element) {
                var title = $(element).children(".title").text();
                var link = $(element).children().attr("href");
                var imglink = $(element).parent().parent().siblings(".thumbnail").children("img").attr("src");
                var bodylink = "https://old.reddit.com"+$(element).parent().parent().parent().data("permalink");
                results.push({
                    title,
                    link,
                    imglink,
                    bodylink
                  });
              });
              for(let i = 0; i<results.length; i++){
                  axios.get(results[i].bodylink).then(function(bodyresp){
                    var newcheer = cheerio.load(bodyresp.data);
                    results[i].bodytext = newcheer("div.link").children(".entry").children(".expando").children(".usertext").children(".usertext-body").text() || "No summary found";
                    db.Article.findOne({
                        bodylink: results[i].bodylink
                    }, function(err, data){
                        if(!data) {
                            console.log("adding article to DB");
                            db.Article.create(results[i])
                        }
                    })
                }) 
              }
              db.Article.find({}, function(err, data){
                  res.render("./index.handlebars", {
                      Articles: data
                  });
              })
              
        });
    })
}