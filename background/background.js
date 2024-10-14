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

    let executing = browser.tabs.executeScript(
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


// console.log("In background.js")
// // Store pending tabs
// let pendingTabs = new Set();

// // Listen for new tab creation
// browser.tabs.onCreated.addListener((tab) => {
//   console.log("In listener with", tab.id)
//   pendingTabs.add(tab.id);
//   console.log(pendingTabs)
// });

// // Listen for tab updates
// browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (pendingTabs.has(tabId) && changeInfo.status === 'complete') {
//     pendingTabs.delete(tabId);
    
//     // Show the approval popup
//     browser.tabs.sendMessage(tabId, { action: "showApprovalPopup" })
//       .then(response => {
//         if (response && response.approved !== undefined) {
//           logTabInfo(tab, response.approved);
//         }
//       })
//       .catch(error => console.error("Error showing approval popup:", error));
//   }
// });

// // Function to log tab information
// function logTabInfo(tab, approved) {
//   let logObject = {
//     url: tab.url,
//     time: Date.now(),
//     title: tab.title,
//     approved: approved
//   };
  
//   browser.storage.local.get("log").then(results => {
//     if (!results.log) {
//       results.log = [];
//     }
//     results.log.push(logObject);
//     return browser.storage.local.set(results);
//   }).catch(error => {
//     console.error("Error logging tab info:", error);
//   });
// }

// // Listen for messages from the content script
// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "tabApproved") {
//     logTabInfo(sender.tab, message.approved);
//   }
// });

