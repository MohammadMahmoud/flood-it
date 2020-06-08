import express from 'express';
import game from './game';

const Router = express.Router();

class Routing {
  static get() {
    Router.get('/', function (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      res.status(200);
      next();
    });

    Router.use('/game', game.get());

    return Router;
  }
}

export default Routing;
