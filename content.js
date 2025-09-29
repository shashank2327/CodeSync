(function() {
    console.log("Codeforces Tracker: Content script injected. Searching for title...");

    const PRECISE_SELECTOR = TO_DO;

    let problemTitle = null;

    const titleElement = document.querySelector(PRECISE_SELECTOR);

    if (titleElement && titleElement.innerText) {
        problemTitle = titleElement.innerText.replace(/^\d+\.\s*/, '');
        console.log(`LeetCode Tracker: SUCCESS! Found title with selector: "${problemTitle}"`);
        
        // Send the found title to the popup script
        chrome.runtime.sendMessage({
            action: 'sendProblemTitle',
            title: problemTitle
        });
    } else {
        console.error(`Codeforces Tracker: Failed. The selector did not find the title element. Codeforces may have updated their site again.`)
    }
})();