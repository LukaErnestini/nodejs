const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
  },
  items: [
    {
      product: { type: Schema.Types.Mixed, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
