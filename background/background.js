function logTabs(tabs) {
    for (const tab of tabs) {
        console.log(tab.url);
    }
}

function onError(error) {
    console.error(`Error: ${error}`);
}

browser.tabs.query({}).then(logTabs, onError)

/**
 * JSON structure:
 * {"log" : [
 * {"url":url,"time":time,"title":title,"approval":approval}, ...
 * ] }
 * 
 * their JSON structure is:
 * {"stats": {
    *  "host": {},
    *  "type": {}
    * }
 * }
 */


// Load existent stats with the storage API.
let gettingStoredStats = browser.storage.local.get();

gettingStoredStats.then(results => {
  // Initialize the saved stats if not yet initialized.
  if (!results.log) {
    results = {
      log: []
    };
  }

//   // Monitor completed navigation events and update
//   // stats accordingly.
//   browser.webNavigation.onCommitted.addListener((evt) => {
//     if (evt.frameId !== 0) {
//       return;
//     }

//     let transitionType = evt.transitionType;
//     results.type[transitionType] = results.type[transitionType] || 0;
//     results.type[transitionType]++;

//     // Persist the updated stats.
//     browser.storage.local.set(results);
//   });

  browser.webNavigation.onCompleted.addListener(evt => {
    // Filter out any sub-frame related navigation event
    if (evt.frameId !== 0) {
      return;
    }

    const time = evt.timeStamp;

    

    const tabId = evt.tabId;
    browser.tabs.get(tabId).then((tab) => {
      logObject = {"url": evt.url, "time": time, "title": tab.title};
      results.log.push(logObject);
      browser.storage.local.set(results);
    });

  }, {
    url: [{schemes: ["http", "https"]}]});
});