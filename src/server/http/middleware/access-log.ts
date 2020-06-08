import express from 'express';
import mung from 'express-mung';
import responder from '../../lib/responder';

const use = (body: Object, req: express.Request, res: express.Response) => {
  return responder(body, req, res);
};

export default mung.json(use);
