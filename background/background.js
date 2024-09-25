function logTabs(tabs) {
    for (const tab of tabs) {
        console.log(tab.url);
    }
}

function onError(error) {
    console.error(`Error: ${error}`);
}

browser.tabs.query({}).then(logTabs, onError)