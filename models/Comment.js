var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
    // `title` must be of type String
    // `body` must be of type String
    body: String
  });
  
  // This creates our model from the above schema, using mongoose's model method
  var Comment = mongoose.model("Comment", CommentSchema);
  
  // Export the Note model
  module.exports = Comment;
  