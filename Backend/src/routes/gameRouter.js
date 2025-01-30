const router = require("express").Router();
const {
  createGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame,
} = require("../controllers/gameController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/", upload.single("file"), createGame);
router.get("/", getAllGames);
router.get("/:id", getGameById);
router.put("/:id", upload.single("file"), updateGame);
router.delete("/:id", deleteGame);

module.exports = router;
