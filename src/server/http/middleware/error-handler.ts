import express from 'express';
import responder from '../../lib/responder';

export class ErrorHandler extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
export const handleError = (
  err: ErrorHandler,
  req: express.Request,
  res: express.Response
) => {
  res.statusCode = 500;
  const response = responder(err, req, res);
  res.status(500).json({ response });
};
