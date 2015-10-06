//
var http = require('http');
var createHandler = require('github-webhook-handler');
var handler = createHandler({ path: '/webhook', secret: 'sekrit' });
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 7777);

// Start server
http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location');
    console.log("oops?");
    console.log(req.rawHeaders);
  });
}).listen(port, host);

handler.on('error', function (err) {
  console.error('Error:', err.message);
});

handler.on('pull_request', function (event) {
  console.log('Received an %s pull_request event for %s PR #%s',
    event.payload.action,
    event.payload.repository.name,
    event.payload.pull_request.number);
  if (event.payload.pull_request.body.search(/Signed-off-by:/) > -1) {
    console.log(event.payload.pull_request.body);
  }
});
