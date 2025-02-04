const router = require("express").Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getCart);
router.post("/", authMiddleware, addToCart);
router.delete("/:gameId", authMiddleware, removeFromCart);
router.delete("/", authMiddleware, clearCart);

module.exports = router;
