import {runCountdown, stopCountdown} from "./utils/timer.js";
console.log("loaded content.ts");
var counter = 0;
var timer;

// selecting a new active tab
chrome.tabs.onActivated.addListener((tab) => {
    // console.log("active tab", tab);
    const {tabId, windowId} = tab;
    // chrome.tabs.getSelected(windowId, (tab) => {
    //     console.log("tab selected", tab);
    // });
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        // console.log("activated tab", tabs);
        if (tabs.length > 0) {
            const {url} = tabs[0];
            // console.log("activated tab url", url);
            const urlProtocol = (new URL(url)?.protocol) || "";
            // console.log(urlProtocol)
            const httpRegex = /^https?:$/;
            if(httpRegex.test(urlProtocol)) {
                console.log("The protocol is either HTTP or HTTPS");
                runCountdown()
                clearInterval(timer);
                timer = setInterval(() => {
                    console.log("counter", counter);
                    counter++;
                }, 1000)
            } else {
                console.log("The protocol is not HTTP or HTTPS");
                stopCountdown();
                clearInterval(timer);
            }
        }
    })

});


// creating a new tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("updated tab", tabId, changeInfo, tab);
});


chrome.windows.onRemoved.addListener((windowId) => {
    // console.log("window removed", windowId);
    chrome.windows.getAll({populate: true}, (windows) => {
        // console.log("windows all", windows);
    })
});



chrome.storage.onChanged.addListener((changes, areaName) => {
    console.log("storage changed", changes, areaName);
});

// http://localhost:8055/admin/login


// activate time if the following happened
// a new tab is created
// a new tab is changed
// a new window is created
// a new click is detected on the webpage


// stop time if a window is closed and there is not other window left
