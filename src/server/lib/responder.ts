import express from 'express';
import status, { statusProprieties } from '../enum/status';
import moment from 'moment';

const responder = (
  body: Object,
  req: express.Request,
  res: express.Response
) => {
  const statusCode = res.statusCode;
  const method = (status as { [key: string]: any })[statusCode] as string;
  const responseBody = {
    meta: method,
    message: body,
  };
  const message = {
    httpRequest: {
      requestTime: `${moment().locale('de').format('D.M.YYYY hh:mm')}`,
      requestMethod: req.method,
      requestUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      status: res.statusCode,
      protocol: req.protocol,
      userAgent: req.get('User-Agent'),
      responseSize: res.get('Content-Length'),
      route: req.path,
      query: req.query,
      requestBody: req.body,
      responseBody: responseBody,
      requestIP: req.ip,
    },
  };
  //Whitelist from logging
  switch (message.httpRequest.requestUrl) {
    case 'http://localhost:3001/favicon.ico':
      return;
    default:
      console.log(JSON.stringify(message, null, 4));
  }
  return responseBody;
};

export default responder;
