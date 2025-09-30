(function() {
    console.log("CP Tracker: Content script injected on Codeforces. Searching for title...");

    const hostname = window.location.hostname;
    let problemTitle = null;
    let titleElement = null;

    if (hostname.includes('leetcode.com')) {
        console.log("CP Tracker: LeetCode site detected.");
        const LEETCODE_SELECTOR = 'div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a';
        titleElement = document.querySelector(LEETCODE_SELECTOR);
        if (titleElement && titleElement.innerText) {
            problemTitle = titleElement.innerText.replace(/^\d+\.\s*/, '');
        }
    } else if (hostname.includes('codeforces.com')) {
        console.log("CP Tracker: Codeforces site detected.");
        const CODEFORCES_SELECTOR = 'div.problem-statement .header .title';
        titleElement = document.querySelector(CODEFORCES_SELECTOR);
        if (titleElement && titleElement.innerText) {
            problemTitle = titleElement.innerText.replace(/^[A-Z0-9]+\.\s*/, '');
        }
    }

    if (problemTitle) {
        console.log(`CP Tracker: SUCCESS! Found title: "${problemTitle}"`);
        chrome.runtime.sendMessage({
            action: 'sendProblemTitle',
            title: problemTitle
        });
    } else {
        console.error(`CP Tracker: FAILED. Could not find title element on this page. The site's structure may have changed.`);
    }
})();

