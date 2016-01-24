#!/usr/bin/env node
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
  var analyser = require('./src/sentiment.js')(dictionary);
  console.log(argv.keyword, analyser.process([argv.keyword]));

  console.log('Keyword:', argv.k)
  console.log('Verbosity:', argv.v ? "on" : "off")
  console.log('Sample size:', argv.s)

  console.log('\nAnalyzed:', "0 Tweets")
  console.log('Positive:', "0")
  console.log('Negative:', "0")
  console.log('Neutral:', "0")
}

