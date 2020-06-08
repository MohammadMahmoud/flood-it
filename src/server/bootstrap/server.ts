//Core
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { Validator, ValidationError } from 'express-json-validator-middleware';
import * as dotenv from 'dotenv';

//Middleware
import AccessLog from '../http/middleware/access-log';
import responder from '../lib/responder';
import compression from 'compression';
import cors from 'cors';
import 'express-async-errors';

//Route
import routes from '../http/routes';

dotenv.config();

class Server {
  static initDeps() {
    return {
      mongodb: mongoose.connect(`mongodb://${process.env.mongoHost}`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }),
    };
  }

  static initComponents() {
    Server.initDeps();
    const middleware = {
      accessLog: AccessLog,
      cors: cors(),
      validator: new Validator({ allErrors: true }).validate,
      bodyParserUrlencoded: bodyParser.urlencoded({ extended: false }),
      bodyParserJSON: bodyParser.json(),
      helmet: helmet(),
      compression: compression(),
    };
    return { middleware };
  }

  static init() {
    const { middleware } = Server.initComponents();
    const app: express.Application = express();
    const port: number = parseInt(process.env.PORT as string, 10) || 3001;
    const router = routes.get();

    //Middleware
    app.use(middleware.bodyParserUrlencoded);
    app.use(middleware.bodyParserJSON);
    app.use(middleware.helmet);
    app.use(middleware.compression);
    app.use(middleware.accessLog);
    app.use(middleware.cors);

    app.use('/', router);
    app.use(
      (
        err: express.ErrorRequestHandler,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (
          err instanceof ValidationError &&
          err.validationErrors.body instanceof Array
        ) {
          const validationErrors = err.validationErrors.body.map((error) => {
            return error.message;
          });
          res.status(400).json(responder(validationErrors, req, res));
          next();
        }
        console.error('server crash', err);
        res.status(500).json(responder({ error: 'Server Crash' }, req, res));
        next();
      }
    );

    const server = app.listen(port, () =>
      console.log(`server listening on port ${port}!`)
    );

    const exitHandler = (errorType: string) => {
      console.info(`\n${errorType} received.`);
      console.log('Closing http server.');
      server.close(async () => {
        console.log('Http server closed.');
        await mongoose.connection.close(false, () => {
          console.log('MongoDb connection closed.');
          process.exit(0);
        });
      });
    };

    //Graceful shutdown
    process.on('SIGINT', () => exitHandler('SIGINT'));
    process.on('SIGTERM', () => exitHandler('SIGTERM'));
    process.on('unhandledRejection', () => exitHandler('unhandledRejection'));
    process.on('uncaughtException', () => exitHandler('uncaughtException'));

    return server;
  }
}
export default Server;
