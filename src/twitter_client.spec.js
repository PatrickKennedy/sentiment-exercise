describe('socialytics', function() {
  var twitter;
  var expect = require('chai').expect;

  before(function() {
    var config = require('../config');
    var TwitterClient = require('./twitter_client');
    twitter = new TwitterClient(config);
  });

  it('should have a TwitterClient', function() {
    expect(twitter).not.to.be.undefined;
  });


  describe('TwitterClient', function() {
    describe('.search', function() {
      it('should return the specified number of tweets', function(done){
        twitter.config.twitter.count = 10;
        twitter.search({q:'bacon'}, function(error, tweets){
          expect(tweets.statuses.length).to.be.within(5,10);
          done(error);
        });
      });

      it('should return the specified number of tweets /w override', function(done){
        twitter.config.twitter.count = 10;
        twitter.search({q:'bacon', count:8}, function(error, tweets){
          expect(tweets.statuses.length).to.be.within(4,8);
          done(error);
        });
      });
    });

    describe('.get_content', function() {
      it('should return just the text from each tweet', function(done){
        twitter.get_content({q:'bacon', count:5}, function(error, content){
          expect(content.length).to.be.within(2,5);
          content.forEach(function(tweet){
            expect(tweet).to.be.a('string');
          });
          done(error);
        });
      });
    });
  });
});
