const Cart = require("../models/cartModel");

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.gameId"
    );
    if (!cart) return res.status(404).json({ message: "Cart is empty" });

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  const { gameId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.gameId.toString() === gameId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ gameId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  const { gameId } = req.params;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.gameId.toString() !== gameId);
    await cart.save();

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
