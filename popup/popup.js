import {
	formatTimeInput,
	incHour,
	decHour,
	incMinSec,
	decMinSec,
} from "./../utils/timer.js";
let selectedActivity = "duration";
let activateBrowsing = false;
let hour = 0;
let minute = 0;
let second = 0;

(async () => {
	console.log("loaded poppup.ts");
	// load the values from the popup on load
	getPopupValues();

	document
		.querySelector("select#activity-selector")
		.addEventListener("change", getPopupValues);
	document
		.querySelector("#hour-inc")?.addEventListener("click", () => {
		hour = incHour(hour);
		setPopupValues();
	});
	document.querySelector("#hour-dec")?.addEventListener("click", () => {
		hour = decHour(hour);
		setPopupValues();
	});
	document.querySelector("#min-inc")?.addEventListener("click", () => {
		minute = incMinSec(minute);
		setPopupValues();
	});
	document.querySelector("#min-dec")?.addEventListener("click", () => {
		minute = decMinSec(minute);
		setPopupValues();
	});
	document.querySelector("#sec-inc")?.addEventListener("click", () => {
		second = incMinSec(second);
		setPopupValues();
	});
	document.querySelector("#sec-dec")?.addEventListener("click", () => {
		second = decMinSec(second);
		setPopupValues();
	});
	document
		.querySelector("button#start-recording")
		.addEventListener("click", async () => {
			console.log("save time clicked");
			getPopupValues();
			// display timer display
			// hides the input
			// hides the save time button

			// chrome.storage.sync.set({ hour, minute, second, selectedActivity }).then(() => {
			// 	console.log("storage set");
			// 	chrome.storage.sync.get(["hour", "minute", "second", "selectedActivity"], (data) => {
			// 		console.log("storage get", data);
			// 	});
			// });
			activateBrowsing = true;
			await chrome.runtime.sendMessage({
				timer: { hour, minute, second },
				activity: { selectedActivity, activateBrowsing },
			});
		});
})();

function setPopupValues() {
	document.querySelector("select#activity-selector").value = selectedActivity;
	document.querySelector("#hour-input").value = formatTimeInput(hour);
	document.querySelector("#min-input").value = formatTimeInput(minute);
	document.querySelector("#sec-input").value = formatTimeInput(second);
	console.log("popup values", { selectedActivity, hour, minute, second });
}

function getPopupValues() {
	selectedActivity = document.querySelector("select#activity-selector").value;
	hour = parseInt(document.querySelector("#hour-input").value);
	minute = parseInt(document.querySelector("#min-input").value);
	second = parseInt(document.querySelector("#sec-input").value);
	console.log("popup values", { selectedActivity, hour, minute, second });
}

function changeActivityHandler(event) {
	selectedActivity = event.target.value;
}
