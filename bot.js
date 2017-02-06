//
var https = require('https');
var http = require('http');
var url = require('url');
var config = require('./config.js')
var createHandler = require('github-webhook-handler');
var checkDCO = require('./src/checkDCO');
var handler = createHandler(config.webhook);
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 7777);
var dco_not_found = '\n\nPlease add a comment with a DCO1.1 Signed-off-by statement in order to allow us to process your pull request.';
var dnf_tail1 ='\n\nFor example a comment like this: "DCO1.1 Signed-off-by: John James <john.james@dcomail.com>"';
var dnf_tail2 ='\n\nEnsure you supply a valid e-mail with the comment';
var doc_found = '\n\nI can confirm that the DCO1.1 sign-off has been included. It is okay to process this pull request.';
var greeting = 'Hi ';
var thanks = ',\n\nThanks for submitting this pull request!';
var signature = '\n\ndco-bot';

function postComment(payload, msg) {
  var tmp = {};
  tmp.body = greeting + payload.pull_request.user.login + thanks + msg + signature;
  var postData = JSON.stringify(tmp);
  var path = url.parse(payload.pull_request.comments_url).pathname;

  var options = {
    hostname: 'api.github.com',
    path: '/upload',
    method: 'POST',
    headers: {
      'User-Agent': 'dco-bot',
      'Content-Type': 'application/vnd.github.VERSION.text+json',
      'Content-Length': postData.length
    }
  };
  options.path = path;
  options.headers.Authorization = new String("token " + config.auth.secret);
  options.headers["User-Agent"] = config.auth.clientid;

  console.log('posting to: ' + path + ' data: ' + postData);

  var req = https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    if (res.statusCode != 201) {
      console.log('HEADERS: ' + JSON.stringify(res.headers));
    };
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      //console.log('BODY: ' + chunk);
    });
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
  if (event.payload.action != 'opened') {
    return;
  }
  console.log('Received an %s pull_request event for %s PR #%s',
    event.payload.action,
    event.payload.repository.name,
    event.payload.pull_request.number);
  if (checkDCO(event.payload.pull_request.body)) {
    postComment(
      event.payload,
      doc_found);
  }
  else {
    postComment(
      event.payload,
      dco_not_found+dnf_tail1+dnf_tail2);
  }
});
