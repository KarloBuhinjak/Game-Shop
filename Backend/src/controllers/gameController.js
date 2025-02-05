const Game = require("../models/gameModel");

const createGame = async (req, res, next) => {
  const { gameName, price, description, stock } = req.body;
  const filename = req.file ? req.file.filename : null;

  if (!filename) {
    return res.status(400).json({ error: "Image file is required" });
  }

  try {
    const game = await Game.create({
      gameName,
      price,
      description,
      stock,
      image: filename,
    });

    res.status(201).json(game);
  } catch (err) {
    next(err);
  }
};

const getAllGames = async (req, res, next) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    next(err);
  }
};

const getGameById = async (req, res, next) => {
  const gameId = req.params.id;
  try {
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json(game);
  } catch (err) {
    next(err);
  }
};

const updateGame = async (req, res, next) => {
  const gameId = req.params.id;
  const { gameName, price, description, stock } = req.body;
  const filename = req.file ? req.file.filename : undefined;

  try {
    const updatedGameData = {
      gameName,
      price,
      description,
      stock,
    };

    if (filename) {
      updatedGameData.image = filename;
    }

    const game = await Game.findByIdAndUpdate(gameId, updatedGameData, {
      new: true,
      runValidators: true,
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json(game);
  } catch (err) {
    next(err);
  }
};

const deleteGame = async (req, res, next) => {
  const gameId = req.params.id;

  try {
    const game = await Game.findByIdAndDelete(gameId);


    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const games = await Game.find();


    res.json({ message: "Game deleted successfully", games: games });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame,
};
