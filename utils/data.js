export function setStorage({hour, minute, second, selectedActivity}) {
    chrome.storage.sync.set({ hour, minute, second, selectedActivity });
}

export function getStorage() {
    return new Promise(resolve => {
        chrome.storage.sync.get(["hour", "minute", "second", "selectedActivity"], (data) => {
            resolve({
                hour: data.hour,
                minute: data.minute,
                second: data.second,
                selectedActivity: data.selectedActivity
            })
        })
    })
    
}

