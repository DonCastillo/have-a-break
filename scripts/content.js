(() => {
    console.log("loaded content.ts");
    chrome.tabs.onActivated.addListener((tab) => {
        console.log("active tab", tab);
    });
})();