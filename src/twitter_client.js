var Twitter = require('twitter');

var TwitterClient = function(config) {
  var self = this;
  self.client = new Twitter(config.twitter);
  self.config = config;
};

TwitterClient.prototype.search = function(options, cb) {
  var self = this;
  var params = {
    q: options.q,
    lang: options.lang || self.config.twitter.lang || "en",
    count: options.count || self.config.twitter.count || 20,
  };
  self.client.get('search/tweets', params, cb);
};

TwitterClient.prototype.get_content = function(options, cb) {
  var self = this;
  self.search(options, function(err, tweets){
    tweet_texts = tweets.statuses.map(function(tweet){
      return tweet.text;
    });
    cb(err, tweet_texts);
  });
};

module.exports = TwitterClient;
