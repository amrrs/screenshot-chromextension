chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureScreenshot") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.captureVisibleTab(tabs[0].windowId, {format: "png"}, dataUrl => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          sendResponse({error: chrome.runtime.lastError.message});
        } else {
          sendResponse({imageDataUrl: dataUrl});
        }
      });
    });
    return true;  // Will respond asynchronously
  }
});