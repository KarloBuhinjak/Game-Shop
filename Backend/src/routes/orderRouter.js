const router = require("express").Router();
const { createOrder } = require("../controllers/orderController");

router.post("/", createOrder);
// router.get("/", getAllUsers);
// router.get("/:id", getUserById);

module.exports = router;
