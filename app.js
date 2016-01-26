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

    .option('c', {
      alias: 'client',
      default: "twitter",
      choices: ['twitter', 'fixed'],
      describe: 'Select the client to query'
    })

    .check(function(argv){
      if(!Number.isInteger(argv.s) || argv.s <= 0)
        throw new Error(`Error: sample-size must be a positive integer. ex. -s 10 | Received: ${argv.s}`);
      return true;
    })
    .argv;


var dictionary = require('./dictionary.json');
main();

function main() {
  var Client = require(`./src/${argv.c}_client.js`)
      , client = new Client(config)
      , analyzer = require('./src/sentiment.js')(dictionary)
      , results = []
      , total = 0
  ;

  var sample_size = parseInt(argv.s);
  sample_size = Number.isInteger(sample_size) ? sample_size : 20;

  console.log('Keyword:', argv.k);
  console.log('Verbosity:', argv.v ? "on" : "off");
  console.log('Sample size:', sample_size);

  client.get_content({q:argv.keyword, count:sample_size}, function(err, content){
    total = content.length;
    content.forEach(function(message) {
      var result = analyzer.process(analyzer.clean(analyzer.format(message)));
      if (typeof result === "undefined")
        return;

      results.push(result);
      if (argv.v) {
        var sentiment = result > 0 ? "Positive" : result < 0 ? "Negative" : "Neutral";
        console.log("Tweet:", message);
        console.log("Sentiment:", sentiment, `(${result})`);
        console.log('-----');
      }
    });

    console.log('\nAnalyzed:', total, "Tweets");
    console.log('Positive:', results.reduce((l, r) => l + (r > 0), 0 ));
    console.log('Negative:', results.reduce((l, r) => l + (r < 0), 0 ));
    console.log('Neutral: ', results.reduce((l, r) => l + (r === 0), 0 ));
  });
}

