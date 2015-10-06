//
var https = require('https');
var http = require('http');
var url = require('url');
var createHandler = require('github-webhook-handler');
var handler = createHandler({ path: '/webhook', secret: 't34B6EKaUgyw' });
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 7777);
var dco_not_found = 'Please add a comment with a DCO1.1 Signed-off-by statement in order to allow us to process your Pull Request.';
var doc_found = 'DCO1.1 signed-off. Okay to process this Pull Request.';

function postComment(address, comment) {
  var tmp = {};
  tmp.body = comment;
  tmp.in_reply_to = 1;
  var postData = JSON.stringify(tmp);
  var path = url.parse(address).pathname;

  var options = {
    hostname: 'api.github.com',
    port: 447,
    path: '/upload',
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.github.VERSION.text+json',
      'Content-Length': postData.length
    }
  };
  options.path = path;

  var req = https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
    res.on('end', function() {
      console.log('No more data in response.')
    })
  });

  req.on('error', function(e) {
    console.log('unable to post comment: ' + e.message);
  });

  // write data to request body
  req.write(postData);
  req.end();
}
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
  if (event.payload.pull_request.body.search(/Signed-off-by:.*<.*@.*>/) > -1) {
    console.log(event.payload.pull_request.body);
    postComment(event.payload.pull_request.review_comments_url, doc_found);
  }
  else {
    console.log('no DCO sign-off found');
    postComment(event.payload.pull_request.review_comments_url, dco_not_found);
  }
});
