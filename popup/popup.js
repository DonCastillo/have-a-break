import { getStorage, setStorage } from "../utils/data.js";
import {
	formatTimeInput,
	incHour,
	decHour,
	incMinSec,
	decMinSec,
} from "./../utils/timer.js";
let selectedActivity = "duration";
let isRecording = false;
let hour = 0;
let minute = 20;
let second = 0;

(async () => {
	console.log("loaded poppup.ts");

	await getInitialValues();
	setPopupValues();
	setStorage({ hour, minute, second, selectedActivity, isRecording });

	document
		.querySelector("select#activity-selector")
		.addEventListener("change", getPopupValues);
	document.querySelector("#hour-inc")?.addEventListener("click", () => {
		hour = incHour(hour);
		setPopupValues();
		setStorage({ hour, minute, second, selectedActivity, isRecording });
	});
	document.querySelector("#hour-dec")?.addEventListener("click", () => {
		hour = decHour(hour);
		setPopupValues();
		setStorage({ hour, minute, second, selectedActivity, isRecording });
	});
	document.querySelector("#min-inc")?.addEventListener("click", () => {
		minute = incMinSec(minute);
		setPopupValues();
		setStorage({ hour, minute, second, selectedActivity, isRecording });
	});
	document.querySelector("#min-dec")?.addEventListener("click", () => {
		minute = decMinSec(minute);
		setPopupValues();
		setStorage({ hour, minute, second, selectedActivity, isRecording });
	});
	document.querySelector("#sec-inc")?.addEventListener("click", () => {
		second = incMinSec(second);
		setPopupValues();
		setStorage({ hour, minute, second, selectedActivity, isRecording });
	});
	document.querySelector("#sec-dec")?.addEventListener("click", () => {
		second = decMinSec(second);
		setPopupValues();
		setStorage({ hour, minute, second, selectedActivity, isRecording });
	});
	document
		.querySelector("button#start-recording")
		.addEventListener("click", async () => {
			console.log("save time clicked");
			isRecording = true;
			getPopupValues();

			await chrome.runtime.sendMessage({
				timer: { hour, minute, second },
				activity: { selectedActivity, isRecording },
			});
			recordingStatus(isRecording);
		});

	document
		.querySelector("button#stop-recording")
		.addEventListener("click", () => {
			isRecording = false;
			console.log("stop recording clicked");
			getPopupValues();
			
			chrome.runtime.sendMessage({
				timer: { hour, minute, second },
				activity: { selectedActivity, isRecording },
			});
			recordingStatus(isRecording);
		});
})();

function setPopupValues() {
	document.querySelector("select#activity-selector").value = selectedActivity;
	document.querySelector("#hour-input").value = hour
		? formatTimeInput(hour)
		: "00";
	document.querySelector("#min-input").value = minute
		? formatTimeInput(minute)
		: "00";
	document.querySelector("#sec-input").value = second
		? formatTimeInput(second)
		: "00";
	console.log("popup values", { selectedActivity, hour, minute, second });
}

async function getPopupValues() {
	selectedActivity =
		document.querySelector("select#activity-selector").value ??
		selectedActivity;
	hour = parseInt(document.querySelector("#hour-input").value) ?? hour;
	minute = parseInt(document.querySelector("#min-input").value) ?? minute;
	second = parseInt(document.querySelector("#sec-input").value) ?? second;
	setStorage({ hour, minute, second, selectedActivity, isRecording });
	console.log("popup values", {
		selectedActivity,
		hour,
		minute,
		second,
		isRecording,
	});
}

async function getInitialValues() {
	await getStorage().then((data) => {
		selectedActivity = data.selectedActivity
			? data.selectedActivity
			: "duration";
		isRecording = data.isRecording ? data.isRecording : false;
		hour = data.hour ? data.hour : 0;
		minute = data.minute ? data.minute : 20;
		second = data.second ? data.second : 0;
	});
}

function recordingStatus(enable) {
	if (enable) {
		document.querySelector("select#activity-selector").disabled = true;
		document.querySelectorAll(".input-cell button").forEach((button) => {
			button.style.display = "none";
		});
		document.querySelector("button#start-recording").style.display = "none";
		document.querySelector("button#stop-recording").style.display = "block";
	} else {
		document.querySelector("select#activity-selector").disabled = false;
		document.querySelector("select#activity-selector").value = "duration";
		document.querySelectorAll(".input-cell button").forEach((button) => {
			button.style.display = "block";
		});
		document.querySelector("button#start-recording").style.display = "block";
		document.querySelector("button#stop-recording").style.display = "none";
	}
}

function displayMessageStatus(text) {
	document.querySelector("#message-status").textContent = text;
}

chrome.storage.onChanged.addListener((changes, areaName) => {
	console.log("detected in storage change in the popup");
	getStorage().then((data) => {
		console.log("storage get", data);
		selectedActivity = data.selectedActivity
			? data.selectedActivity
			: "duration";
		hour = data.hour !== undefined ? data.hour : 0;
		minute = data.minute !== undefined ? data.minute : 20;
		second = data.second !== undefined ? data.second : 0;
		isRecording = data.isRecording !== undefined ? data.isRecording : false;
		setPopupValues();
		recordingStatus(isRecording);
	});
});
