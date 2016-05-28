/*eslint-env node */
var validateEmail = require('./validateEmail');

// validate that DCO has been signed off
function checkDCO(body) {
  var sig = body.match(/Signed-off-by:.*<.*@.*>/);
  if (sig != null) {
    var s = sig[0].match(/<.*@.*>/);
    return validateEmail(s[0].slice(1, s[0].length - 1));
  }
  else {
    return false;
  }
}
module.exports = checkDCO;
