MAX_ITEMS = 5

function addElements(element, array, callback) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }

  for (let i=0; i < Math.min(array.length, MAX_ITEMS); i++) {
    const listItem = document.createElement("li");
    listItem.textContent = callback(array[i]);
    element.appendChild(listItem);
  }
}


/**
 * Function to download data:
 */
function DataDownload() {
  console.log("DataDownload function called");
  browser.storage.local.get("log").then(results => {
    if (!results.log || results.log.length === 0) {
      console.log("No data to download")
      return;
    }
    const logList = JSON.stringify(results.log);
    const blob = new Blob([logList], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    browser.downloads.download({
      url: url,
      filename: 'storage.json',
      conflictAction: 'uniquify',
      saveAs: false
    }).then(() => {
      URL.revokeObjectURL(url);
      console.log("Download completed");
    }).catch(error => {
      console.error("Download failed:", error);
    });
  }).catch(error => {
    console.error("Error getting data from storage:", error)
  });
}

/**
 * Function to open the options page
 */
function openOptions() {
  browser.runtime.openOptionsPage();
  window.close();
}

function listenForClicks() {
  //console.log("Setting up click listeners");
  document.addEventListener("click", (e) => {
    console.log("Click event detected on:", e.target);
    if (e.target.id === "data-download") {
      DataDownload();
    } else if (e.target.id === "open-settings") {
      console.log("Settings paged opened");
      openOptions();
  }});
}

// display the stored data
let gettingStoredStats = browser.storage.local.get("log");
gettingStoredStats.then(results => {
  console.log("In gettingStoredStats")
  if (!results.log || results.log.length === 0) {
    console.log("Array is empty")
    return;
  }

  let listElement = document.getElementById("url-list");
  addElements(listElement, results.log, (log) => { 
    return `url: ${log.url} at time ${log.time} \nwith title ${log.title} with result ${log.approved}`;
  });

}).catch(error => {
  console.error("Error loading stored stats:", error);
});

// Set up click listeners when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  listenForClicks();
});

