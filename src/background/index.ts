chrome.runtime.onMessage.addListener(async (request) => {
    if (request.action === "enqueue") {
        await queue();
    }
});


const queue = async () => {
    chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon48.jpg"),
        title: "Hello World",
        message: `Enqueued at ${new Date().toLocaleTimeString()}`,
        priority: 2,
    });

    chrome.runtime.sendMessage({
        action: "queueCompleted",
    });
};