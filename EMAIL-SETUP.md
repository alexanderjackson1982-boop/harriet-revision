# Daily progress email: setup

Takes about 5 minutes. You need a Google account.

1. Go to **script.google.com** and click **New project**. Rename it `Harriet revision email`.
2. Delete the sample code and paste in everything from `progress-email.gs`. Click **Save**.
3. In the function dropdown at the top, choose **setUpDailyEmail** and click **Run**. Google asks for permission to send email as you. Click **Review permissions**, choose your account, then **Advanced → Go to Harriet revision email** and **Allow**. You get a first test email straight away.
4. Click **Deploy → New deployment**. Click the cog next to "Select type" and choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
5. In the GitHub repository, open `assets/app.js`, click the pencil icon, and paste the URL between the quotes on the line `const SYNC_URL = "";`. Commit the change.

From then on, every tick, rating, quiz and note updates the summary, and you get an email at 8pm every day.

To change the time or the address, edit `SEND_HOUR` or `EMAIL_TO` at the top of the script and run **setUpDailyEmail** again.
