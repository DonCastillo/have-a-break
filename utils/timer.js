export function displayTimer(value) {
    if(value < 10) {
        return `0${value}`.toString();
    }
    return value.toString();
}

export function incHour(currentHour) {
	if (currentHour < 23) {
		currentHour++;
	} else {
		currentHour = 0;
	}
    return currentHour;
} 

export function decHour(currentHour) {
	if (currentHour > 0) {
		currentHour--;
	} else {
		currentHour = 23;
	}
    return currentHour
}

export function incMinSec(currentMinSec) {
    if (currentMinSec < 59) {
		currentMinSec++;
	} else {
		currentMinSec = 0;
	}
    return currentMinSec;
}

export function decMinSec(currentMinSec) {
	if (currentMinSec > 0) {
		currentMinSec--;
	} else {
		currentMinSec = 59;
	}
	return currentMinSec;
}

export function runCountdown() {
	console.log("run countdown")
	chrome.storage.local.set({ name: "Don" }).then(() => {
		console.log("storage set")
		chrome.storage.local.get("name").then((data) => {
			console.log("storage get", data);
		});
	})

}

export function stopCountdown() {
	console.log("stop countdown");
}