const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const styles = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, code, contentJSON = {}, type = 'application/json') => {
  // check format type
  let content = '';
  if (type === 'application/json') {
    content = JSON.stringify(contentJSON);
  } else if (type === 'text/xml') {
    content = '<response>';
    content = `${content} <message>${contentJSON.message}</message>`;
    if (contentJSON.id) {
      content = `${content} <id>${contentJSON.id}</id>`;
    }
    content = `${content} </response>`;
  } else { // text/html or text/css
    content = contentJSON;
  }

  response.writeHead(code, { 'Content-Type': type });
  response.write(`${content}`);
  response.end();
};

const respondMeta = (request, response, contentJSON) => {
  response.write(`${contentJSON}`);
  response.end();
}

const getIndex = (request, response, acceptedTypes, params) => {
  respond(request, response, 200, index, 'text/html', acceptedTypes, params);
};

const getStyles = (request, response, acceptedTypes, params) => {
  respond(request, response, 200, styles, 'text/css', acceptedTypes, params);
};

const success = (request, response, acceptedTypes, params) => respond(
  request,
  response,
  200,
  { message: 'This is a successful response' },
  acceptedTypes[0],
  params,
);

const successMeta = (request, response) => respondMeta(
    request,
    response,
    { message: 'This is a successful response' }
);

const badRequest = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  // check error type
  let code = 200;
  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    code = 404;
  }

  return respond(request, response, code, responseJSON, acceptedTypes[0]);
};

const unauthorized = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  // check error type
  let code = 200;
  if (!params.loggedIn || params.valid !== 'yes') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    responseJSON.id = 'unauthorized';
    code = 401;
  }

  return respond(request, response, code, responseJSON, acceptedTypes[0]);
};

const forbidden = (request, response, acceptedTypes, params) => respond(
  request,
  response,
  403,
  {
    id: 'forbidden',
    message: 'You do not have access to this content.',
  },
  acceptedTypes[0],
  params,
);

const internal = (request, response, acceptedTypes, params) => respond(
  request,
  response,
  500,
  {
    id: 'internalError',
    message: 'Internal Server Error. Something went wrong.',
  },
  acceptedTypes[0],
  params,
);

const notImplemented = (request, response, acceptedTypes, params) => respond(
  request,
  response,
  501,
  {
    id: 'notImplemented',
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
  },
  acceptedTypes[0],
  params,
);

const notFound = (request, response, acceptedTypes, params) => respond(
  request,
  response,
  404,
  {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  },
  acceptedTypes[0],
  params,
);

module.exports = {
  getIndex,
  getStyles,
  success,
  successMeta,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
