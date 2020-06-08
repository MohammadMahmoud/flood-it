import express from 'express';
import { Validator } from 'express-json-validator-middleware';
import progressGameSchema from '../../../schema/put-api-game.json';
import gameController from '../../controllers/game';

const Router = express.Router();
const validator = new Validator({ allErrors: true });
const validate = validator.validate;

class Routing {
  static get() {
    // GET api/game
    Router.get('/', gameController.createGame);

    // PUT api/game/:id
    Router.put(
      '/:id',
      validate({ body: JSON.parse(JSON.stringify(progressGameSchema)) }),
      gameController.progressGame
    );

    //GET api/game/:id/solve
    Router.get('/:id/solve', gameController.solveGame);

    return Router;
  }
}

export default Routing;
