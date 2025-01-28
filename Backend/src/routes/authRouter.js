const router = require("express").Router();
const { authUser } = require("../controllers/authController");

router.post("/", authUser);

module.exports = router;
