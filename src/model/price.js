const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  salePrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Unit",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Post",
  },
});

priceSchema.methods.toJSON = function () {
  const price = this;
  const priceObject = price.toObject();
  return priceObject;
};

priceSchema.index({ "$**": "text" });
const Price = mongoose.model("Price", priceSchema,"prices");

module.exports = Price;
