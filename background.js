import { setStorage } from "./utils/data.js";
import { countdown } from "./utils/timer.js";

// import {runTimer, stopTimer} from "./utils/timer.js";
console.log("loaded content.ts");
let counter = 0;
let timer;
let activateBrowsing = false;
let selectedActivity = "duration";
let hour = 0;
let minute = 0;
let second = 0;


// selecting a new active tab
chrome.tabs.onActivated.addListener((tab) => {
    const {tabId, windowId} = tab;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        // console.log("activated tab", tabs);
        if (tabs.length > 0) {
            const {url} = tabs[0];
            const urlProtocol = (new URL(url)?.protocol) || "";
            const httpRegex = /^https?:$/;
            if(httpRegex.test(urlProtocol)) {

                // active listener if there's a select activity and activate browsing is true
                if(selectedActivity === "duration" && activateBrowsing) {
                    runTimer()
                }
                

            } else {

                if(selectedActivity === "duration" && activateBrowsing) {
                    stopTimer();
                    
                }
               
            }
        }
    })

});


function runTimer() {
    console.log("run countdown")
    clearInterval(timer);
    timer = setInterval(() => {
        // decrement the timer
        // send update to popup to sync
        console.log("counter", counter);
        let countdownParams = countdown({hour, minute, second}, 1);
        hour = countdownParams.hour;
        minute = countdownParams.minute;
        second = countdownParams.second;
        setStorage({hour, minute, second, selectedActivity});
        console.log("hour: ", hour, "minute: ", minute, "second: ", second);
        counter++;
    }, 1000)
}

function stopTimer() {
    console.log("stop count")
    clearInterval(timer);
}

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



// chrome.storage.onChanged.addListener((changes, areaName) => {
//     console.log("storage changed", changes, areaName);
// });

// http://localhost:8055/admin/login


// activate time if the following happened
// a new tab is created
// a new tab is changed
// a new window is created
// a new click is detected on the webpage


// stop time if a window is closed and there is not other window left

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("message received", message, sender);
    if(message.timer) {
        hour = message.timer.hour;
        minute = message.timer.minute;
        second = message.timer.second;
    }
    if(message.activity) {
        selectedActivity = message.activity.selectedActivity;
        activateBrowsing = message.activity.activateBrowsing;
    }
    if(!activateBrowsing) {
        stopTimer();
    }
})