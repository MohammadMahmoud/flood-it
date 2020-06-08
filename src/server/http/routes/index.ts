import express from 'express';
import api from './api';
import * as dotenv from 'dotenv';
import responder from '../../lib/responder';

const Router = express.Router();

dotenv.config();

class Routing {
  static get() {
    Router.get('/', (req: express.Request, res: express.Response) => {
      res.status(200).send({
        appName: process.env.appName,
        version: process.env.appVer,
      });
    });
    Router.get(
      '/favicon.ico',
      (req: express.Request, res: express.Response) => {
        res.status(200);
      }
    );

    Router.use('/api', api.get());

    Router.use('/*', (req, res) => {
      res.status(401).json(
        responder(
          {
            error: 'Invalid path or user credentials',
          },
          req,
          res
        )
      );
    });

    return Router;
  }
}

export default Routing;
