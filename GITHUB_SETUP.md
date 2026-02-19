# How to Push Your Code to GitHub (soumyadeep531/CHESS)

This guide will help you upload your local project files to your GitHub repository: [https://github.com/soumyadeep531/CHESS](https://github.com/soumyadeep531/CHESS)

Since your project is already a Git repository (it has a `.git` folder), follow these steps:

## Step 1: Check Current Status
Open your terminal (Command Prompt or PowerShell) in the project folder and run:
```bash
git status
```
This will show you which files are new or modified.

## Step 2: Add Files to Staging
To stage all your changes for commit, run:
```bash
git add .
```

## Step 3: Commit Your Changes
Save your changes with a descriptive message:
```bash
git commit -m "Update project files"
```

## Step 4: Link to GitHub Repository
You need to ensure your local repository is connected to the correct remote repository on GitHub.

1.  **Check existing remote:**
    ```bash
    git remote -v
    ```

2.  **If no remote is listed**, add the origin:
    ```bash
    git remote add origin https://github.com/soumyadeep531/CHESS.git
    ```

3.  **If a remote is already listed but it's different**, update it:
    ```bash
    git remote set-url origin https://github.com/soumyadeep531/CHESS.git
    ```

4.  **Important:** ensure your default branch is named `main` (GitHub's default):
    ```bash
    git branch -M main
    ```

## Step 5: Push to GitHub
Finally, upload your commits to GitHub:
```bash
git push -u origin main
```

---

### Troubleshooting
-   **If `git push` fails because of unrelated history**:
    If you created the repo on GitHub with a README or License and have local files too, you might need to force the push (be careful, this overwrites the remote):
    ```bash
    git push -u origin main --force
    ```
    OR pull the remote changes first (safer):
    ```bash
    git pull origin main --allow-unrelated-histories
    ```

-   **Authentication**:
    If asked for a password, you may need to use a **Personal Access Token** instead of your account password, or sign in via the browser prompt if using Git Credential Manager.
