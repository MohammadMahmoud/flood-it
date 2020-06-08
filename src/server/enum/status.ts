/**
 * Status object structure
 * {
 *     statusCode: 200,   <-- this is the statusCode to return on the API
 *     code: 1010,		  <-- this is our error code for this error
 *     message: 'Error',  <-- error message
 *     details: [],       <-- error details to be presented to the user
 *     retryable: true,   <-- whether this status is retryable with the same payload to get a successful result in the future
 * }
 */

export interface statusProprieties {
  statusCode: number;
}

export default {
  200: {
    statusCode: 200,
    code: 200,
    message: 'OK',
    details: [],
  },

  201: {
    statusCode: 201,
    code: 201,
    message: 'Created',
    details: [],
  },

  204: {
    statusCode: 204,
    code: 204,
    message: 'No Content',
    details: [],
    retryable: true,
  },

  400: {
    statusCode: 400,
    code: 400,
    message: 'Bad Request',
    details: [],
    retryable: false,
  },

  401: {
    statusCode: 401,
    code: 401,
    message: 'Unauthorized',
    details: [],
    retryable: false,
  },

  403: {
    statusCode: 403,
    code: 403,
    message: 'Invalid User',
    details: [],
    retryable: false,
  },

  404: {
    statusCode: 404,
    code: 404,
    message: 'Not Found',
    details: [],
    retryable: false,
  },

  406: {
    statusCode: 406,
    code: 406,
    message: 'Not Acceptable',
    details: [],
    retryable: false,
  },

  408: {
    statusCode: 408,
    code: 408,
    message: 'Request Timeout',
    details: [],
    retryable: true,
  },

  409: {
    statusCode: 409,
    code: 409,
    message: 'Conflict',
    details: [],
    retryable: false,
  },

  429: {
    statusCode: 429,
    code: 429,
    message: 'Too Many Requests',
    details: [],
    retryable: true,
  },

  500: {
    statusCode: 500,
    code: 500,
    message: 'Internal Error',
    details: [],
    retryable: false,
  },
  501: {
    statusCode: 501,
    code: 501,
    message: 'Not Implemented',
    details: [],
    retryable: false,
  },
  502: {
    statusCode: 502,
    code: 502,
    message: 'Bad Gateway',
    details: [],
    retryable: false,
  },
};
