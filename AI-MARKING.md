# AI marking (optional)

AI marking is built in but switched off. While it is off, the website looks and works exactly as before.

## How it works

1. Harriet writes an answer and taps "Mark my answer with AI".
2. The website sends the question, marks, marking guidance, any source text and her answer to the Google Apps Script that already sends the daily email.
3. The script checks the access code and the usage limits, then asks the Anthropic API for feedback.
4. Feedback comes back as an AI estimate. She can improve her answer and mark it again to compare.

The API key is stored only in the script's private Script properties. It is never in the website, this repository or the browser.

Nothing personal is sent to the model: no name, school, email address or revision history.

## Switching it on

1. Create an Anthropic API account at platform.claude.com. Add a small amount of credit and set a monthly spend limit (for example $5).
2. Create an API key.
3. Open the Apps Script project, then Project Settings, then Script properties. Add `ANTHROPIC_API_KEY` with the key as its value.
4. In the editor, run `setUpAiMarking`. The log shows Harriet's access code.
5. Run `runMarkingEval` and read the results email before going further.
6. If the results are good, set the Script property `AI_ENABLED` to `yes`.
7. Harriet enters the access code once on her device.

## Switching it off

Set `AI_ENABLED` to `no`. The button disappears the next time the page loads.

## Limits

These are set as Script properties:

- `AI_DAILY_LIMIT`: default 30 marks a day.
- `AI_TOTAL_LIMIT`: default 400 marks in total.
- Answers longer than 3,000 characters are refused.
- `AI_MODEL`: default `claude-sonnet-5-5`. Use `claude-haiku-5-5` for a cheaper option.
