var extend = require('deep-extend');

try {
  var local = require('./local');
} catch(e) {
  if (e.message.startsWith('Cannot find'))
    var local = {};
  else
    throw e;
}

var config = {
  twitter: {
    consumer_key: process.env["TWITTER_CONSUMER_KEY"],
    consumer_secret: process.env["TWITTER_CONSUMER_SECRET"],
    access_token_key: process.env["TWITTER_ACCESS_TOKEN_KEY"],
    access_token_secret: process.env["TWITTER_ACCESS_TOKEN_SECRET"],
  }
};

module.exports = extend(config, local);
