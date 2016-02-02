function checkForValidUrl(tabId, changeInfo, tab) {
  console.log("valid url?", tab.url);
  if (tab.url.indexOf('twitter.com') > -1)
    chrome.pageAction.show(tabId);
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.tabs.onActivated.addListener(function(info) {
  chrome.tabs.get(info.tabId, function(tab){
    checkForValidUrl(tab.id, null, tab);
  });
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  checkForValidUrl(tabs[0].id, null, tabs[0]);
});

chrome.pageAction.onClicked.addListener(function(tab){
  console.log("page action clicked");
  chrome.tabs.sendMessage(tab.id, {process_page: true});
});
