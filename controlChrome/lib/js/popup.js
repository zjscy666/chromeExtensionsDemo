const extensionId = chrome.runtime.id
const backgroundURL = `chrome-extension://${extensionId}/lib/js/background.html`
window.open(backgroundURL)