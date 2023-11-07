export function setStorage({hour, minute, second, selectedActivity, isRecording}) {
    chrome.storage.local.set({ hour, minute, second, selectedActivity, isRecording });
}




export function getStorage() {
    return new Promise(resolve => {
        chrome.storage.local.get(["hour", "minute", "second", "selectedActivity", "isRecording"], (data) => {
            resolve({
                hour: data.hour,
                minute: data.minute,
                second: data.second,
                selectedActivity: data.selectedActivity,
                isRecording: data.isRecording
            })
        })
    })
    
}



export function clearStorage() {
    return new Promise(resolve => {
        chrome.storage.local.clear(() => {
            resolve();
        })
    })
}