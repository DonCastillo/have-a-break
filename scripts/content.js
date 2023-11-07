(async () => {
	console.log("loaded content.ts");

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		console.log("request", request);
		if (request.action === "FINISH") {
			alert("Have a break!");
		}
	});

	document.querySelector("body").addEventListener("click", () => {
        console.log("clicked")
		if (isHttpProtocol()) {
			chrome.runtime.sendMessage({ action: "RUN_TIMER" });
		}
	});

	window.onscroll = function () {
        console.log("clicked")
		if (isHttpProtocol()) {
			chrome.runtime.sendMessage({ action: "RUN_TIMER" });
		}
	};

    function isHttpProtocol() {
        const urlProtocol = new URL(window.location.href)?.protocol || "";
        const httpRegex = /^https?:$/;
        if (urlProtocol) {
            if (httpRegex.test(urlProtocol)) {
                return true;
            }
        }
        return false;
    }
})();


