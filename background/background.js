function logTabs(tabs) {
    for (const tab of tabs) {
        console.log(tab.url);
    }
}


function onError(error) {
    console.error(`Error: ${error}`);
}


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


function logTabInfo(evt, response) {
  const time = evt.timeStamp;
  const tabId = evt.tabId;

  browser.tabs.get(tabId).then((tab) => {
    let logObject = {"url": evt.url, "time": time, "title": tab.title, "approved": response.approved};
    results.log.push(logObject);
    browser.storage.local.set(results);
  });
}


/**
 * This is our listener for logging purposes 
 */
  browser.webNavigation.onCommitted.addListener(evt => {
    // Filter out any sub-frame related navigation event
    if (evt.frameId !== 0) {
      return;
    }

    let executing = browser.tabs.executeScript(evt.tabId,
    { "file": "/content-scripts/approval.js" }                // object
    )
    executing.then( async () => {
      console.log("done it before");
      let response = await browser.tabs.sendMessage(evt.tabId, {
      command: "showApprovalPopup"});

      console.log("It happened")
      console.log(response)
      logTabInfo(evt, response);
      });

  }, {
    url: [{schemes: ["http", "https"]}]});
});