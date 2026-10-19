# Harriet's Mock Countdown

A revision website for Harriet's GCSE mocks: a tickable plan for 20 October to 1 November 2026, quick quizzes, a tracker for topics she's stuck on, a mistake log, and every revision link in one place.

## Put it online with GitHub Pages (about 5 minutes)

1. Sign in to GitHub and click **New repository** (the green button, or the **+** at the top right).
2. Name it `harriet-revision`. Choose **Public**. Click **Create repository**.
3. On the new page, click **uploading an existing file**.
4. Drag in everything from this folder: `index.html`, `README.md`, `.nojekyll` and the whole `assets` folder. Click **Commit changes**.
5. Go to **Settings → Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main** and folder to **/ (root)**. Click **Save**.
6. Wait a minute or two, then refresh the Pages screen. Your link appears at the top. It will look like `https://YOUR-USERNAME.github.io/harriet-revision/`.

Send that link to Harriet and she can add it to her phone's home screen.

## Good to know

- **Her progress saves in her own browser.** Ticks, ratings, notes and quiz scores stay on the device she uses. To move to another device, use **Where I'm stuck → Download backup**, then **Restore from backup** on the new one.
- **Public repository.** Anyone with the link can see the plan, but not her saved progress, which never leaves her device.
- **Changing the plan.** Edit `assets/data.js` on GitHub (click the file, then the pencil icon). Each block lists its subject, title, what to do, what to use, and its links.
- **Adding quiz questions.** Edit `assets/quizzes.js`. Copy an existing question and change the text. `c` is the position of the correct answer, counting from 0.
