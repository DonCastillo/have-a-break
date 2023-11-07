(() => {
    console.log("loaded content.ts");
   
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("request", request);
        if(request.action === "FINISH") {
            alert("Have a break!");
        }
    });
})();