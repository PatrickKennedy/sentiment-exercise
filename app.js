#!/usr/bin/env node
var config = require('./config');
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
  ;

  var sample_size = parseInt(argv.s);
  sample_size = Number.isInteger(sample_size) ? sample_size : 20;

  console.log('Keyword:', argv.k);
  console.log('Verbosity:', argv.v ? "on" : "off");
  console.log('Sample size:', sample_size);

  client.get_content({q:argv.keyword, count:sample_size}, function(err, content){
    var total = content.length;

    if (argv.v)
      console.log(); // a pleasing line break

    content.forEach(function(message, index) {
      var result = analyzer.process(analyzer.clean(analyzer.format(message)));
      var score = result.score;
      var hits = result.hits;
      if (typeof score === "undefined")
        return;

      results.push(score);

      if (argv.v) {
        Object.keys(result.hits).forEach(function(word){
          var regex = new RegExp(`\\b(${word})\\b`, 'i');
          var color = hits[word] > 0 ? "\x1b[32m" : hits[word] < 0 ? "\x1b[31m" : "\x1b[37m";
          message = message.replace(regex, `${color}$1\x1b[0m`);
        });

        var sentiment = score > 0 ? "Positive" : score < 0 ? "Negative" : "Neutral";
        var color = score > 0 ? "\x1b[32m" : score < 0 ? "\x1b[31m" : "\x1b[37m";
        console.log("Tweet:", message);
        console.log(`Sentiment: ${color}${sentiment}\x1b[0m (${result.score})`);
        console.log('-----');
      }
    });

    console.log('\nAnalyzed:', total, "Tweets");
    console.log('Positive:', results.reduce((l, r) => l + (r > 0), 0 ));
    console.log('Negative:', results.reduce((l, r) => l + (r < 0), 0 ));
    console.log('Neutral: ', results.reduce((l, r) => l + (r === 0), 0 ));
  });
}

