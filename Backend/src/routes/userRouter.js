const router = require("express").Router();
const {
  createUser,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;
