#!/usr/bin/env node
var config = require('./config');
var fs = require('fs');
var parse = require('csv-parse');
var argv = require('yargs')
    .usage('Usage: node main.js [options]')
    .option('k', {
      alias: 'keyword',
      demand: true,
      describe: 'Keyword for Twitter search'
    })

    .option('s', {
      alias: 'sample-size',
      default: 20,
      describe: 'The number of tweets to sample'
    })

    .option('v', {
      alias: 'verbose',
      default: false,
      describe: 'Run verbosely'
    })
    .argv;


var dictionary = {};
fs.createReadStream('./dictionary.csv')
  .pipe(parse({}, function(err, data){
    data.forEach(function(line) {
      dictionary[line[0]] = {positive: 1, negative: -1}[line[1]] || 0;
    });
  }))
  .on('end', main);

function main() {
  var TwitterClient = require('./src/twitter_client.js')
      , twitter = new TwitterClient(config)
      , analyser = require('./src/sentiment.js')(dictionary)
      , results = []
  ;

  var sample_size = parseInt(argv.s);
  sample_size = Number.isInteger(sample_size) ? sample_size : 20;
  twitter.config.twitter.count = sample_size;

  console.log('Keyword:', argv.k);
  console.log('Verbosity:', argv.v ? "on" : "off");
  console.log('Sample size:', sample_size);

  twitter.get_tweet_texts(argv.keyword, function(err, tweet_texts){
    tweet_texts.forEach(function(tweet) {
      var result = analyser.process(tweet.toLowerCase().split(' '));
      if (typeof result === "undefined")
        return;

      results.push(result);
      if (argv.v) {
        var sentiment = result > 0 ? "Positive" : result < 0 ? "Negative" : "Neutral";
        console.log("Tweet:", tweet);
        console.log("Sentiment:", sentiment, "("+ result +")");
        console.log('-----');
      }
    });

    console.log('\nAnalyzed:', results.length, "Tweets");
    console.log('Positive:', results.reduce((l, r) => l + (r > 0), 0 ));
    console.log('Negative:', results.reduce((l, r) => l + (r < 0), 0 ));
    console.log('Neutral: ', results.reduce((l, r) => l + (r == 0), 0 ));
  });
}

