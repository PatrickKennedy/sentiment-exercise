var Analyzer = function(dictionary){
  var self = this;
  self.dictionary = dictionary;
};

Analyzer.prototype.process = function(words) {
  var self = this;
  // quick and dirty way of turning a string into an array but keeping arrays
  // the same. This should eventually throw an error.
  words = [].concat(words);
  var map = words.map(function(word){ return self.dictionary[word]; });
  if (map.every(function(word){ return word === undefined; }))
    return undefined;

  return map.reduce(function(score, sentiment) {
    return score + (sentiment || 0);
  }, 0);
};

var instance;

module.exports = function(dictionary) {
  instance = instance || new Analyzer(dictionary)
  return instance;
};
