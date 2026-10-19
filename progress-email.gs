/**
 * Harriet's revision: daily progress email.
 * Paste this into a new Google Apps Script project (script.google.com).
 * Setup steps are in EMAIL-SETUP.md.
 */

const SECRET = "harriet-mocks-2026";   // must match SYNC_KEY in assets/app.js
const SEND_HOUR = 20;                  // 8pm UK time
const EMAIL_TO = "";                   // leave blank to email the Google account that owns this script

/* Receives progress from the website */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.key !== SECRET) return out_("bad key");
    delete data.key;
    data.received = new Date().toISOString();
    PropertiesService.getScriptProperties().setProperty("latest", JSON.stringify(data));
    return out_("ok");
  } catch (err) {
    return out_("error");
  }
}

function doGet() { return out_("Harriet's revision tracker is running."); }

function out_(t) { return ContentService.createTextOutput(t); }

/* Run once by hand to create the daily trigger */
function setUpDailyEmail() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("sendDailyEmail").timeBased().atHour(SEND_HOUR).everyDays(1).inTimezone("Europe/London").create();
  sendDailyEmail(); // sends a first email now so you can see it works
}

function sendDailyEmail() {
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty("latest");
  const to = EMAIL_TO || Session.getEffectiveUser().getEmail();
  const today = Utilities.formatDate(new Date(), "Europe/London", "EEEE d MMMM");

  if (!raw) {
    MailApp.sendEmail({ to, subject: `Harriet's revision: ${today}`, htmlBody: "<p>No progress has been received from the website yet. Once Harriet ticks a block or takes a quiz, it will show here.</p>" });
    return;
  }

  const d = JSON.parse(raw);
  const prevDone = Number(props.getProperty("prevDone") || 0);
  const gained = Math.max(0, d.done - prevDone);
  props.setProperty("prevDone", String(d.done));

  const isoToday = Utilities.formatDate(new Date(), "Europe/London", "yyyy-MM-dd");
  const day = (d.days || []).find(x => x.date === isoToday);
  const last = Utilities.formatDate(new Date(d.received), "Europe/London", "EEE d MMM, HH:mm");
  const pct = d.total ? Math.round(d.done / d.total * 100) : 0;

  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const li = arr => arr.length ? "<ul>" + arr.map(x => `<li>${esc(x)}</li>`).join("") + "</ul>" : "<p style='color:#666'>None.</p>";

  let html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#16182b;max-width:560px">`;
  html += `<h2 style="margin:0 0 4px">Harriet's revision: ${today}</h2>`;
  html += `<p style="margin:0 0 16px;color:#666">Last activity: ${last}</p>`;
  html += `<p style="font-size:28px;font-weight:bold;margin:0">${d.done} / ${d.total} blocks <span style="font-size:16px;color:#666">(${pct}%)</span></p>`;
  html += `<div style="height:10px;background:#dfe1ee;border-radius:5px;margin:6px 0 16px"><div style="height:10px;width:${pct}%;background:#4b3fe0;border-radius:5px"></div></div>`;
  html += `<p><b>${gained}</b> new block${gained === 1 ? "" : "s"} ticked since the last email.</p>`;

  if (day) {
    html += `<h3>Today's plan</h3><ul>` + day.blocks.map(b => `<li>${b.done ? "✅" : "⬜"} ${esc(b.subject)}: ${esc(b.title)}</li>`).join("") + `</ul>`;
  }
  html += `<h3>Topics she's stuck on (red)</h3>` + li(d.red || []);
  html += `<h3>Getting there (amber)</h3>` + li(d.amber || []);
  const q = Object.entries(d.quizzes || {});
  html += `<h3>Best quiz scores</h3>` + (q.length ? "<ul>" + q.map(([s, v]) => `<li>${esc(s)}: ${v}</li>`).join("") + "</ul>" : "<p style='color:#666'>No quizzes taken yet.</p>");
  html += `<p><b>${d.mistakesOpen || 0}</b> mistakes logged and not yet fixed.</p>`;
  if ((d.questions || []).length) html += `<h3>Questions she wants to ask a teacher</h3>` + li(d.questions);
  html += `<p style="color:#666;font-size:13px;margin-top:24px">Sent automatically from Harriet's Mock Countdown.</p></div>`;

  MailApp.sendEmail({ to, subject: `Harriet's revision: ${d.done}/${d.total} blocks · ${today}`, htmlBody: html });
}
