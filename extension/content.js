console.log("running sentimentalizier");

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
    return score + ({positive: 1, negative: -1}[sentiment] || 0);
  }, 0);
};


var dictionary = {};
var analyzer = {};

jQuery.getJSON(chrome.extension.getURL('/dictionary.json'), function(data) {
  dictionary = data;
  analyzer = new Analyzer(dictionary);
  process_page();
});

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  console.log("page action clicked");
  process_page();
});


function process_page() {
  var tweets = jQuery(".tweet");
  tweets.each(function(index){
    var tweet = jQuery(this);
    var tweet_text = tweet.find(".tweet-text").text();
    var icon_bar = tweet.find(".stream-item-header");

    // skip tweets we've seen already to avoid duplication
    if(tweet.data("socialytics"))
      return true;
    else
      tweet.data("socialytics", true);

    var sentiment = analyzer.process(tweet_text.split(' '));

    console.log(sentiment, tweet_text);
    if (typeof sentiment === "undefined")
      return true;

    var icon = "";
    var background_color = "rgba(0,0,0,0)";
    if (sentiment > 0) {
      icon = `<span class="Tweet-geo u-floatRight js-tooltip" data-original-title="Positive Tweet">
    <a class="ProfileTweet-actionButton u-linkClean">
      <span class="Icon Icon--check" style="font-size: 13px; color: forestgreen;"></span>
    </a>
</span>`;
      background_color = "rgba(0,100,0,0.075)";
    } else if (sentiment < 0) {
      icon = `<span class="Tweet-geo u-floatRight js-tooltip" data-original-title="Negative Tweet">
    <a class="ProfileTweet-actionButton u-linkClean">
      <span class="Icon Icon--close" style="font-size: 14px; line-height: 15px; color: crimson;"></span>
    </a>
</span>`;
      background_color = "rgba(100,0,0,0.075)";
    } else if (sentiment == 0) {
      icon = `<span class="Tweet-geo u-floatRight js-tooltip" data-original-title="Neutral Tweet">
    <a class="ProfileTweet-actionButton u-linkClean">
      <span class="Icon Icon--remove" style="font-size: 14px; color: #aab8c2;"></span>
    </a>
</span>`;
      background_color = "rgba(50,100,200,0.075)";
    }

    icon_bar.append(jQuery(icon)[0]);
    tweet.css({"background-color": background_color});
  });
}
