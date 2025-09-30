# CodeSync: CP Problem Tracker - Chrome Extension

A simple and efficient Chrome extension to save competitive programming problems from **LeetCode** and **Codeforces** directly to your personal **GitHub repository** as Markdown files.  

🚀 Never lose track of a problem again. Keep all your problem-solving history organized in one place!

---

## ✨ Features

- **One-Click Saving**: Quickly save problem details without leaving the problem page.  
- **Multi-Platform Support**: Works seamlessly with both **LeetCode** and **Codeforces**.  
- **Organized File Structure**: Automatically saves problems into `LeetCode-Problems/` or `Codeforces-Problems/` folders in your repo.  
- **Custom Metadata**: Add a status (`Solved`, `Attempted`, `To-Do`) and custom tags to each problem.  
- **Secure**: Your GitHub token and repository details are stored locally and securely using **Chrome's Storage API**.  

---

## 🔧 Installation

Since this extension is **not** on the Chrome Web Store, you need to load it manually in **Developer Mode**.

1. **Download the Code**  
   - Download this repository as a **ZIP** and unzip it, or clone it using:  
     ```bash
     git clone <repository-url>
     ```

2. **Open Chrome Extensions**  
   - Open Google Chrome and go to:  
     ```
     chrome://extensions
     ```

3. **Enable Developer Mode**  
   - In the top-right corner, turn on the **Developer mode** switch.  

4. **Load the Extension**  
   - Click **Load unpacked** (top-left).  
   - Select the folder where you unzipped or cloned this repository.  

✅ The **CP Problem Tracker** extension should now appear in your extensions list and Chrome toolbar.

---

## ⚙️ Configuration

Before saving problems, connect the extension to your **GitHub account**.

### 1. Generate a GitHub Personal Access Token (PAT)

1. Go to:  
   **GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)**  
2. Click **Generate new token (classic)**.  
3. Give it a descriptive name (e.g., `CP Tracker Extension`).  
4. Set an **Expiration date** (e.g., 90 days).  
5. Check ✅ **repo** permission.  
6. Click **Generate token**.  
7. **Copy the token immediately** (you cannot see it again later).

---

### 2. Configure the Extension

1. Click the extension’s icon in the Chrome toolbar.  
2. On the **Settings page**:  
   - Paste your **GitHub Personal Access Token**.  
   - Enter your **GitHub Username** (e.g., `shashank2327`).  
   - Enter the **Repository Name** where you want to save problems (e.g., `TryingOut`).  
3. Click **Save Settings**.  

---

## ▶️ How to Use

1. Navigate to a problem page on **LeetCode** or **Codeforces**.  
2. Click the extension’s icon in the toolbar.  
3. A popup will appear with the problem’s **title** and **URL** pre-filled.  
4. Select a **status** and add any relevant **tags** (comma-separated).  
5. Click **Add to GitHub**.  

🎉 A success message will appear, and a new **Markdown file** will be created in your specified GitHub repository inside the appropriate folder.  

---

