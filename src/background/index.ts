chrome.runtime.onMessage.addListener(async (request) => {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    const tabId = tab.id;

    if (request.action === "enqueue") {
        if (tabId) await queue(tabId);
    }
});


const queue = async (tabId: number) => {
    chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon48.jpg"),
        title: "Hello World",
        message: `Enqueued at ${new Date().toLocaleTimeString()}`,
        priority: 2,
    });
    chrome.tabs.sendMessage(tabId, { action: "queueCompleted" })
};