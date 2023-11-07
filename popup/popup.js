import {
	displayTimer,
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

	document
		.querySelector("#activity-selector")
		.addEventListener("change", changeActivityHandler);
	document.querySelector("#hour-inc")?.addEventListener("click", () => {
		hour = incHour(hour);
		updateTimerInputs();
	});
	document.querySelector("#hour-dec")?.addEventListener("click", () => {
		hour = decHour(hour);
		updateTimerInputs();
	});
	document.querySelector("#min-inc")?.addEventListener("click", () => {
		minute = incMinSec(minute);
		updateTimerInputs();
	});
	document.querySelector("#min-dec")?.addEventListener("click", () => {
		minute = decMinSec(minute);
		updateTimerInputs();
	});
	document.querySelector("#sec-inc")?.addEventListener("click", () => {
		second = incMinSec(second);
		updateTimerInputs();
	});
	document.querySelector("#sec-dec")?.addEventListener("click", () => {
		second = decMinSec(second);
		updateTimerInputs();
	});
	document
		.querySelector("button#save-time")
		.addEventListener("click", async () => {
			console.log("save time clicked");
			hour = parseInt(document.querySelector("#hour-input").value);
			minute = parseInt(document.querySelector("#min-input").value);
			second = parseInt(document.querySelector("#sec-input").value);
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

function updateTimerInputs() {
	document.querySelector("#hour-input").value = displayTimer(hour);
	document.querySelector("#min-input").value = displayTimer(minute);
	document.querySelector("#sec-input").value = displayTimer(second);
}

function changeActivityHandler(event) {
	console.log("changing activity handler....");
	selectedActivity = event.target.value;
}
