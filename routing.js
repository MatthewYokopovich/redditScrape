var axios = require("axios");
var cheerio = require("cheerio");
module.exports = (app) => {
    app.get("/", (req, res) => {
        axios.get("https://old.reddit.com/r/pics/").then(function (response) {
            var $ = cheerio.load(response.data);
            var results = [];
            $("p.title").each(function(i, element) {
                var title = $(element).text();
                var link = $(element).children().attr("href");
                var imglink = $(element).parent().parent().siblings(".thumbnail").children("img").attr("src");
                var bodylink = "https://old.reddit.com"+$(element).parent().parent().siblings(".thumbnail").attr("href");
                axios.get(bodylink).then(function(bodyresp){
                    
                })
                results.push({
                  title,
                  link,
                  imglink: imglink || "No image found",
                  bodylink
                });
              });
              res.json(results);
        });
    })
}