const Order = require("../models/orderModel");
const Game = require("../models/gameModel");

createOrder = async (req, res, next) => {
  try {
    const { items, totalPrice } = req.body;
    const customerId = req.user._id;
    console.log(req.user._id);

    const order = new Order({ customerId, items, totalPrice });
    await order.save();

    for (let item of items) {
      const game = await Game.findById(item.gameId);
      if (!game) {
        throw new Error(`Game with ID ${item.gameId} not found`);
      }

      if (game.stock < item.quantity) {
        throw new Error(`Not enough stock for ${game.gameName}`);
      }

      game.stock -= item.quantity;
      await game.save();
    }

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      //   .populate("game")
      .populate("customerId", "firstName lastName")
      .populate("items.gameId", "gameName price")
      .exec();

    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      customer: {
        firstName: order.customerId.firstName,
        lastName: order.customerId.lastName,
      },
      items: order.items.map((item) => ({
        gameName: item.gameId.gameName,
        quantity: item.quantity,
        price: item.gameId.price,
      })),
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    }));

    res.status(200).json(formattedOrders);
  } catch (err) {
    next(err);
  }
};

getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate("items.gameId", "gameName price")
      .exec();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id })
      .populate("items.gameId", "gameName price")
      .exec();
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
};
