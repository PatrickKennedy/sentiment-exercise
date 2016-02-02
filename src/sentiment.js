var Analyzer = function(dictionary){
  var self = this;
  self.dictionary = dictionary;
};

Analyzer.prototype.format = function(words, options) {
  options = options || {};
  return words.split(options.delimiter || ' ');
};

Analyzer.prototype.clean = function(words, options) {
  options = options || {};
  return words.map(function(word){
    word = word.toLowerCase();
    word = word.replace(options.regex || /\W+/, '');
    return word;
  });
};

Analyzer.prototype.process = function(words) {
  var self = this;
  var any_defined;
  var hits = {};

  // quick and dirty way of turning a string into an array but keeping arrays
  // the same. This should eventually throw an error.
  words = [].concat(words);

  var map = words.map(function(word){
    var sentiment = self.dictionary[word];
    var score = ({positive: 1, negative: -1}[sentiment] || 0);

    any_defined = any_defined || sentiment;

    if (sentiment != null && !hits[word])
      hits[word] = score;

    return score;
  });

  if (!any_defined)
    return {score: undefined, hits: {}};

  return {
    score: map.reduce((t, s) => t + s, 0),
    hits: hits,
  };
};

var instance;

module.exports = function(dictionary) {
  instance = instance || new Analyzer(dictionary);
  return instance;
};
