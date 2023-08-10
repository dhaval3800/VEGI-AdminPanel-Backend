const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: {
    type: Buffer,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  // prices: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Price'
  // }]
});

postSchema.virtual("prices", {
  ref: "Price",
  localField: "_id",
  foreignField: "post",
});

// mongoose.model('Av', AvSchema, 'av');

postSchema.methods.toJSON = function () {
  const post = this;
  const postObject = post.toObject();

  delete postObject.image;

  return postObject;
};

const Post = mongoose.model("Post", postSchema,'posts');

module.exports = Post;
