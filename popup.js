    // DOM Elements
const mainView = document.getElementById('main-view');
const settingsView = document.getElementById('settings-view');
const problemInfo = document.getElementById('problem-info');
const problemForm = document.getElementById('problem-form');
const notCfPage = document.getElementById('not-cf-page'); // Renamed
const settingsForm = document.getElementById('settings-form');
const githubTokenInput = document.getElementById('github-token');
const githubOwnerInput = document.getElementById('github-owner');
const githubRepoInput = document.getElementById('github-repo');
const statusMessage = document.getElementById('status-message');

// Form Inputs
const problemTitleInput = document.getElementById('problem-title');
const problemUrlInput = document.getElementById('problem-url');
const problemStatusInput = document.getElementById('problem-status');
const problemTagsInput = document.getElementById('problem-tags');

let githubToken = '';
let repoOwner = '';
let repoName = '';
let contentScriptTimeout;

// --- Main Logic ---

document.addEventListener('DOMContentLoaded', async () => {
    const result = await chrome.storage.sync.get(['githubToken', 'repoOwner', 'repoName']);
    if (result.githubToken && result.repoOwner && result.repoName) {
        githubToken = result.githubToken;
        repoOwner = result.repoOwner;
        repoName = result.repoName;
        showMainView();
        getCurrentTabInfo();
    } else {
        if (result.githubToken) githubTokenInput.value = result.githubToken;
        if (result.repoOwner) githubOwnerInput.value = result.repoOwner;
        if (result.repoName) githubRepoInput.value = result.repoName;
        showSettingsView();
    }
});

// --- View Management ---

function showMainView() {
    settingsView.classList.add('hidden');
    mainView.classList.remove('hidden');
}

function showSettingsView() {
    mainView.classList.add('hidden');
    settingsView.classList.remove('hidden');
}

// --- Event Handlers ---

settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = githubTokenInput.value.trim();
    const owner = githubOwnerInput.value.trim();
    const repo = githubRepoInput.value.trim();

    if (token && owner && repo) {
        await chrome.storage.sync.set({
            githubToken: token,
            repoOwner: owner,
            repoName: repo
        });
        githubToken = token;
        repoOwner = owner;
        repoName = repo;
        showMainView();
        getCurrentTabInfo();
    }
});

problemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = problemTitleInput.value;
    const url = problemUrlInput.value;
    const status = problemStatusInput.value;
    const tags = problemTagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean);
    
    const addButton = document.getElementById('add-button');
    addButton.disabled = true;
    addButton.textContent = 'Adding...';
    
    await createGitHubFile(title, url, status, tags);
    
    addButton.disabled = false;
    addButton.textContent = 'Add to GitHub';
});

// --- Core Functions ---

async function getCurrentTabInfo() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // UPDATED: Check for Codeforces URL patterns
    const isCodeforcesUrl = tab.url && (tab.url.includes('codeforces.com/problemset/problem') || tab.url.includes('codeforces.com/contest'));

    if (isCodeforcesUrl) {
        problemUrlInput.value = tab.url; // Use the full URL for Codeforces
        
        contentScriptTimeout = setTimeout(() => {
            problemInfo.innerHTML = `<p class="error">Error: Could not retrieve problem title. Codeforces' site structure may have changed.</p>`;
        }, 3000);

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });
    } else {
        problemInfo.classList.add('hidden');
        notCfPage.classList.remove('hidden');
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'sendProblemTitle') {
        clearTimeout(contentScriptTimeout);
        problemInfo.classList.add('hidden');
        problemForm.classList.remove('hidden');
        problemTitleInput.value = message.title;
    }
});

async function createGitHubFile(title, url, status, tags) {
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
    // UPDATED: Save in a Codeforces-specific folder
    const filePath = `Codeforces-Problems/${sanitizedTitle}.md`;
    const fileContent = `# ${title}\n\n**Problem URL:** [${title}](${url})\n\n**Status:** ${status}\n\n**Tags:** ${tags.join(', ')}\n`;
    const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    // UPDATED: Commit message
    const commitMessage = `Add Codeforces problem: ${title}`;

    console.log('Attempting to create file at:', apiUrl);
    
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: commitMessage,
                content: encodedContent
            })
        });

        if (response.status === 201) {
            const data = await response.json();
            console.log(`---> The file was created at this URL: ${data.content.html_url} <---`);
            showStatusMessage(`Success! File '${sanitizedTitle}.md' created.`, 'success');
            setTimeout(() => window.close(), 10000);
        } else if (response.status === 422) {
             showStatusMessage('Error: File with this name already exists.', 'error');
        } else if (response.status === 401) {
            showStatusMessage('Error: Invalid GitHub Token. Check token and permissions.', 'error');
        } else if (response.status === 404) {
            showStatusMessage('Error: Repository not found. Check owner/repo name.', 'error');
        } else {
            const error = await response.json();
            showStatusMessage(`GitHub Error: ${error.message}`, 'error');
        }
    } catch (error) {
        showStatusMessage('Network Error. Check your internet connection.', 'error');
    }
}

function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type;
    if (type === 'success') {
        setTimeout(() => statusMessage.textContent = '', 4000);
    }
}

