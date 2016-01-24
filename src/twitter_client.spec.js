describe('socialytics', function() {
  var twitter;
  var expect = require('chai').expect

  before(function() {
    var config = require('../config');
    var TwitterClient = require('./twitter_client');
    twitter = new TwitterClient(config);
  });

  it('should have a TwitterClient', function() {
    expect(twitter).not.to.be.undefined;
  });


  describe('TwitterClient', function() {
    describe('#search', function() {
      it('should return the specified number of tweets', function(done){
        twitter.config.twitter.count = 10;
        twitter.search('bacon', function(error, tweets){
          expect(tweets.statuses.length).to.equal(10);
          done(error);
        });
      });
    });

    describe('#get_tweet_texts', function() {
      it('should return just the text from each tweet', function(done){
        twitter.config.twitter.count = 5;
        twitter.get_tweet_texts('bacon', function(error, tweet_texts){
          expect(tweet_texts.length).to.equal(5);
          tweet_texts.forEach(function(tweet){
            expect(tweet).to.be.a('string');
          });
          done(error);
        });
      });
    });
  });
});
