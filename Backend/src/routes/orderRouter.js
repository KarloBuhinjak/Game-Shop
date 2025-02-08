const router = require("express").Router();
const {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
} = require("../controllers/orderController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getAllOrders);
router.get("/user", authMiddleware, getOrdersByUser);
router.get("/:id", authMiddleware, getOrderById);

module.exports = router;
