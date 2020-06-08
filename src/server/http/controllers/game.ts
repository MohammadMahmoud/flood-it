import express from 'express';
import GameModel from '../models/game';
import GameEngine from '../../lib/game-engine';

export default abstract class GameController {
  // GET api/game
  static async createGame(req: express.Request, res: express.Response) {
    const gameEngine = new GameEngine();
    const newGame = gameEngine.createGame();
    const coloredGrid = gameEngine.convertToColor(newGame.grid);
    const createGame = new GameModel(newGame);
    await createGame.save().then((newGame) => {
      res.json({
        gameId: newGame._id,
        grid: coloredGrid,
        solvedTurns: newGame.solvedTurns,
        playerTurns: newGame.playerTurns,
      });
    });
  }

  // PUT api/game/:id
  static async progressGame(req: express.Request, res: express.Response) {
    const params = req.params;
    const body = req.body;
    const game = await GameModel.findById(params.id);
    if (game) {
      const existingGame = new GameEngine(
        game.size,
        game.playerTurns,
        game.grid,
        game.visited,
        game.solvedTurns
      );
      const newGrid = existingGame.progressGame(body.color);
      game.grid = [];
      game.visited = newGrid.visited;
      game.playerTurns = newGrid.playerTurns;
      game.grid = newGrid.grid;
      game.save();
      res.json(newGrid);
    }
  }

  //GET api/game/:id/solve
  static async solveGame(req: express.Request, res: express.Response) {
    const params = req.params;
    const game = await GameModel.findById(params.id);
    if (game) {
      const gameEngine = new GameEngine(
        game.size,
        game.playerTurns,
        game.grid,
        game.visited
      );
      const solvedGame = gameEngine.solveGame();
      res.json(solvedGame);
    }
  }
}
