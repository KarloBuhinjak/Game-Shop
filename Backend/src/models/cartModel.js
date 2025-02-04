const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  items: [
    {
      gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "game",
        required: true,
      },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

const Cart = mongoose.model("cart", CartSchema);
module.exports = Cart;
