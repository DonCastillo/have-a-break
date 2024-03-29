import { clearStorage, setStorage } from "./utils/data.js";
import { countdown } from "./utils/timer.js";

console.log("loaded content.ts");
let counter = 0;
let timer;
let isRecording = false;
let selectedActivity = "duration";
let hour = 0;
let minute = 0;
let second = 0;

// selecting a new active tab
chrome.tabs.onActivated.addListener((tab) => {
	const { tabId, windowId } = tab;
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs.length > 0) {
			const { url } = tabs[0];
        console.log(url)

			if (url) {
				const urlProtocol = new URL(url)?.protocol || "";
				const httpRegex = /^https?:$/;
				if (httpRegex.test(urlProtocol)) {
                    isRecording = true;
					if (selectedActivity === "duration" && isRecording) {
						runTimer();
					}
				} else {
					if (selectedActivity === "duration" && isRecording) {
						stopTimer();
					}
				}
			}
		}
	});
});

// creating a new tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (tab) {
		const { url } = tab;
        console.log(url)
		if (url) {
			const urlProtocol = new URL(url)?.protocol || "";
			const httpRegex = /^https?:$/;
			if (httpRegex.test(urlProtocol)) {
                isRecording = true;
				if (selectedActivity === "duration" && isRecording) {
					runTimer();
				}
			} else {
				if (selectedActivity === "duration" && isRecording) {
					stopTimer();
				}
			}
		}
	}
});

function runTimer() {
	console.log("run countdown");
    if (hour < 0 || minute < 0 || second < 0) {
        stopTimer();
        hour = 0;
        minute = 0;
        second = 0;
    }
	clearInterval(timer);
	isRecording = true;
	timer = setInterval(async () => {
		// decrement the timer
		// send update to popup to sync
		console.log("counter", counter);
		let countdownParams = countdown({ hour, minute, second }, 1);
		hour = countdownParams.hour;
		minute = countdownParams.minute;
		second = countdownParams.second;
		setStorage({ hour, minute, second, selectedActivity, isRecording });
        
		if (hour === 0 && minute === 0 && second === 0) {
			stopTimer();
			await finishTimer();
			// alert user that time is up
		}
		console.log("hour: ", hour, "minute: ", minute, "second: ", second);
		counter++;
	}, 1000);
}

function stopTimer() {
	console.log("stop count");
	clearInterval(timer);
	isRecording = false;
}

async function finishTimer() {
	console.log("finish timer");
	await clearStorage();
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs.length > 0) {
			const { id, url } = tabs[0];
			console.log("sedning message to ", url);
			chrome.tabs.sendMessage(id, { action: "FINISH" });
		}
	});
}

// chrome.windows.onRemoved.addListener((windowId) => {
// 	// console.log("window removed", windowId);
// 	chrome.windows.getAll({ populate: true }, (windows) => {
// 		// console.log("windows all", windows);
// 	});
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("message received", message, sender);
	if (message.timer) {
		hour = message.timer.hour;
		minute = message.timer.minute;
		second = message.timer.second;
	}
	if (message.activity) {
		selectedActivity = message.activity.selectedActivity;
		isRecording = message.activity.isRecording;
	}
	if (!isRecording) {
		stopTimer();
	}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("message received", message, sender);
	if (message.action === "RUN_TIMER") {
		runTimer();
	}
});

chrome.runtime.onInstalled.addListener(async () => {
	console.log("installed");
    isRecording = false;
	await clearStorage();

    for (const cs of chrome.runtime.getManifest().content_scripts) {
        for (const tab of await chrome.tabs.query({url: cs.matches})) {
          chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: cs.js,
          });
        }
      }
});
