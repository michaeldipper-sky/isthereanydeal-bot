const http = require('http');

function createHTTPServer() {
  // heroku sets a value for process.env.PORT
  let port = process.env.PORT;
  // but we need to set a manual one for running locally
  if (port == null || port === '') {
    port = 8000;
  }
  http.createServer((req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end('Hello World!');
  }).listen(port);
}

module.exports = createHTTPServer;
