import { clearStorage, setStorage } from "./utils/data.js";
import { countdown } from "./utils/timer.js";

// try {
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
				const urlProtocol = new URL(url)?.protocol || "";
				const httpRegex = /^https?:$/;
				if (httpRegex.test(urlProtocol)) {
					if (selectedActivity === "duration" && isRecording) {
						runTimer();
					}
				} else {
					if (selectedActivity === "duration" && isRecording) {
						stopTimer();
					}
				}
			}
		});
	});

	// creating a new tab
	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (tab) {
			const { url } = tab;
			const urlProtocol = new URL(url)?.protocol || "";
			const httpRegex = /^https?:$/;
			if (httpRegex.test(urlProtocol)) {
				if (selectedActivity === "duration" && isRecording) {
					runTimer();
				}
			} else {
				if (selectedActivity === "duration" && isRecording) {
					stopTimer();
				}
			}
		}
	});

	function runTimer() {
		console.log("run countdown");
		clearInterval(timer);
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
	}

	async function finishTimer() {
        isRecording = false;
        console.log("finish timer")
		await clearStorage();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const {id, url} = tabs[0];
                console.log("sedning message to ", url);
                chrome.tabs.sendMessage(id, {action: "FINISH"});
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
// } catch (error) {
//     console.log(error);
// }
