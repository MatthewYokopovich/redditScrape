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
    app.post("/submit", (req, res) =>{
        var articleID = req.body.articleID;
        db.Comment.create({
            body: req.body.body
        }).then(dbComment =>{
            return db.Article.findOneAndUpdate({
                _id: articleID
            }, {
                $push: {
                    comments: dbComment._id
                }
            });
        })
    })
    app.get("/:id", (req, res) =>{
        var idtoget = req.params.id;
        console.log(idtoget);
        db.Article.find({
            _id: idtoget
        }).populate("comments")
        .then(dbArt =>{
            return res.send(dbArt);
        })
    })
    app.delete("/delete/:id", (req, res) =>{
        var idtodel = req.params.id;
        db.Comment.findOneAndRemove({
            _id: idtodel
        }, function(err, com){
            res.send("success");
        })
        res.send("success");
    })
}