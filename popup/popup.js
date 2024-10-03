// Get the saved stats and render the data in the popup window.
const MAX_ITEMS = 5;

function sorter(array) {
  return Object.keys(array).sort((a, b) => {
    return array[a] <= array[b];
  });
}

function addElements(element, array, callback) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }

  for (let i=0; i < array.length; i++) {
    if (i >= MAX_ITEMS) {
      break;
    }

    const listItem = document.createElement("li");
    listItem.textContent = callback(array[i]);
    element.appendChild(listItem);
  }
}

let gettingStoredStats = browser.storage.local.get();
gettingStoredStats.then(results => {
  if (!results || !results.log || results.log.length === 0) {
    return;
  }

  let listElement = document.getElementById("url-list");
  addElements(listElement, results.log, (log) => { 
    return `url: ${log.url} at time ${log.time}`;
  });

});