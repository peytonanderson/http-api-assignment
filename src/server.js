const http = require('http');
const url = require('url');
const query = require('querystring');
const handler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': handler.getIndex,
  '/styles.css': handler.getStyles,
  '/success': handler.success,
  '/badRequest': handler.badRequest,
  '/unauthorized': handler.unauthorized,
  '/forbidden': handler.forbidden,
  '/internal': handler.internal,
  '/notImplemented': handler.notImplemented,
  notFound: handler.notFound,
};

const onRequest = (request, response) => {
  console.log(request.url);

  const parsedUrl = url.parse(request.url);
  const acceptedTypes = request.headers.accept.split(',');
  const params = query.parse(parsedUrl.query);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    urlStruct.notFound(request, response, acceptedTypes, params);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
