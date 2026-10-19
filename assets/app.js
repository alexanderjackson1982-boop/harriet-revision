(() => {
"use strict";

const KEY = "harriet-mocks-site-v1";
const MOCKS = new Date(2026, 10, 9); // 9 November 2026
const blank = () => ({ ticks: {}, rag: {}, notes: {}, missed: {}, best: {}, log: [], qs: [], cards: [], studyLog: {} });
let st = blank();
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === "object") st = Object.assign(blank(), s); } catch (e) {}
/* Daily email: paste the Apps Script web app URL between the quotes to switch it on */
const SYNC_URL = "https://script.google.com/macros/s/AKfycbx2D7tm-GFaB5KlZbrL-3YHpjSfHbGxQuMmx1kfVhF048eAeX8OyIuGElQMTs4dmQXh/exec";
const SYNC_KEY = "harriet-mocks-2026";
let syncTimer = null;
const save = () => {
  try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  if (SYNC_URL) { clearTimeout(syncTimer); syncTimer = setTimeout(sync, 2500); }
};
function summary() {
  let done = 0, total = 0;
  const days = DAYS.filter(d => !d.gap).map(d => ({ date: d.date, name: d.name, blocks: d.blocks.map((b, i) => {
    const w = b[5] || 1, ok = !!st.ticks[`${d.id}-${i}`]; total += w; if (ok) done += w;
    return { subject: SUBJECTS[b[0]].name, title: b[1], done: ok };
  }) }));
  const rated = c => Object.entries(st.rag).filter(([, v]) => v === c).map(([k]) => { const [s, t] = k.split("|"); return `${SUBJECTS[s] ? SUBJECTS[s].name : s}: ${t}`; });
  const quizzes = {}; Object.entries(st.best).forEach(([s, v]) => { quizzes[SUBJECTS[s] ? SUBJECTS[s].name : s] = `${v.score} / ${v.total}`; });
  return { key: SYNC_KEY, done, total, days, red: rated("r"), amber: rated("a"), quizzes,
    mistakesOpen: st.log.filter(r => (r.w || "").trim() && !r.f).length,
    questions: st.qs.filter(q => (q.t || "").trim() && !q.done).map(q => q.t),
    flash: { total: st.cards.length, made: st.cards.filter(c => !c.pack).length, reviewedToday: (st.studyLog || {})[todayISO()] || 0, mastered: st.cards.filter(c => c.box >= 4).length } };
}
function sync() {
  try { fetch(SYNC_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(summary()) }).catch(() => {}); } catch (e) {}
}
window.addEventListener("pagehide", () => { if (SYNC_URL && syncTimer) { clearTimeout(syncTimer); try { navigator.sendBeacon(SYNC_URL, new Blob([JSON.stringify(summary())], { type: "text/plain" })); } catch (e) {} } });

const $ = s => document.querySelector(s);
const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v;
    else if (k === "style") n.style.cssText = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) n.setAttribute(k, v === true ? "" : v);
  }
  kids.flat().forEach(c => c != null && n.append(c.nodeType ? c : document.createTextNode(c)));
  return n;
};
const col = s => `var(${SUBJECTS[s].colour})`;
const pad = n => String(n).padStart(2, "0");
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const todayShort = () => { const d = new Date(); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
const topicKey = (s, t) => `${s}|${t}`;

/* ---------- PLAN ---------- */
const studyDays = DAYS.filter(d => !d.gap);
const blockWeight = b => b[5] || 1;

function renderHours() {
  const count = {};
  studyDays.forEach(d => d.blocks.forEach(b => { count[b[0]] = (count[b[0]] || 0) + blockWeight(b); }));
  const box = $("#hours");
  Object.entries(count).sort((a, b) => b[1] - a[1]).forEach(([s, n]) =>
    box.append(el("span", { style: `--c:${col(s)}` }, el("b", {}, String(n)), SUBJECTS[s].name)));
}

function renderStrip() {
  const cal = [["20","Tue","study","tue20"],["21","Wed","study","wed21"],["22","Thu","study","thu22"],["23","Fri","study","fri23"],["24","Sat","off"],["25","Sun","off"],["26","Mon","study","mon26"],["27","Tue","study","tue27"],["28","Wed","away"],["29","Thu","away"],["30","Fri","away"],["31","Sat","away"],["1","Sun","study","sun1"]];
  const iso = todayISO();
  cal.forEach(([n, w, type, id]) => {
    const dayIso = n === "1" ? "2026-11-01" : `2026-10-${n}`;
    const label = type === "study" ? "Study" : type === "off" ? "Off" : "Away";
    const e = el(id ? "a" : "div", { class: `d ${type}${dayIso === iso ? " today" : ""}`, href: id ? "#" + id : null, "data-day": id || null, "aria-label": `${w} ${n}: ${label}` },
      el("em", {}, w), el("b", {}, n), el("em", {}, label));
    $("#strip").append(e);
  });
}

function renderDays() {
  const box = $("#days");
  const iso = todayISO();
  DAYS.forEach(d => {
    if (d.gap) { box.append(el("div", { class: "gap" }, d.gap)); return; }
    const isToday = d.date === iso;
    const card = el("article", { class: `day${isToday ? " is-today" : ""}`, id: d.id });
    card.append(el("div", { class: "dayhead" },
      el("div", {}, el("h2", {}, d.name, isToday ? el("span", { class: "todaytag" }, "Today") : null), el("div", { class: "when" }, d.when)),
      el("span", { class: "chipcount", "data-count": "" })));
    let slot = 1;
    d.blocks.forEach((b, i) => {
      const [s, title, what, use, links, span] = b;
      const n = span || 1;
      const label = n > 1 ? `Blocks ${slot} and ${slot + 1}` : `Block ${slot}`;
      slot += n;
      const key = `${d.id}-${i}`;
      const box = el("input", { type: "checkbox", class: "tick", id: key, "data-key": key, "data-w": n, "aria-label": `Done: ${title}` });
      box.addEventListener("change", () => { st.ticks[key] = box.checked; save(); refresh(); });
      card.append(el("div", { class: "block", style: `--c:${col(s)}`, "data-key": key },
        box, el("span", { class: "stripe" }),
        el("div", { class: "bbody" },
          el("div", { class: "btop" }, el("span", { class: "subj" }, SUBJECTS[s].name), el("span", { class: "slot" }, label)),
          el("label", { class: "btitle", for: key }, title),
          el("p", { class: "what" }, what),
          el("div", { class: "use" }, el("b", {}, "Use"), el("span", {}, use)),
          resources(key, links || []))));
    });
    const subs = [...new Set(d.blocks.map(b => b[0]))];
    card.append(el("div", { class: "close" },
      el("span", {}, "Close out: a quick quiz or 10 minutes of flashcards, then update your mistake log."),
      el("span", { class: "row-actions" }, subs.map(s => el("button", { type: "button", onclick: () => { location.hash = "quiz"; startQuiz(s); } }, `Quiz: ${SUBJECTS[s].name}`)))));
    box.append(card);
  });
}

/* ---------- RESOURCES: video boxes, worksheet cards, links ---------- */
const ytId = u => { const m = String(u).match(/youtu\.be\/([\w-]{11})/) || String(u).match(/[?&]v=([\w-]{11})/); return m ? m[1] : null; };
function resources(key, links) {
  const vids = (typeof VIDEOS !== "undefined" && VIDEOS[key] ? VIDEOS[key] : []).map(([t, id]) => ({ t, id }));
  const sheets = [], sites = [];
  links.forEach(([t, u]) => {
    if (/youtube\.com\/results/.test(u)) return;
    const id = ytId(u);
    if (id) { if (!vids.some(v => v.id === id)) vids.push({ t: (x => x.charAt(0).toUpperCase() + x.slice(1))(t.replace(/^Video:\s*/i, "")), id }); return; }
    (/\.pdf($|\?)/i.test(u) ? sheets : sites).push([t, u]);
  });
  if (!vids.length && !sheets.length && !sites.length) return null;
  const box = el("div", { class: "res" });
  if (vids.length) box.append(el("div", { class: "reslabel" }, `Watch · ${vids.length} video${vids.length > 1 ? "s" : ""}`),
    el("div", { class: "vids" }, vids.map(v => el("button", { type: "button", class: "vid", "aria-label": `Play video: ${v.t}`, onclick: () => openVideo(v) },
      el("span", { class: "thumb", style: `background-image:url(https://i.ytimg.com/vi/${v.id}/mqdefault.jpg)` }, el("i", { class: "play", "aria-hidden": "true" })),
      el("span", { class: "vt" }, v.t)))));
  if (sheets.length) box.append(el("div", { class: "reslabel" }, "Practise · worksheets"),
    el("div", { class: "sheets" }, sheets.map(([t, u]) => el("a", { class: "sheet", href: u, target: "_blank", rel: "noopener" }, el("b", { "aria-hidden": "true" }, "PDF"), el("span", {}, t.replace(/\s*worksheet$/i, ""))))));
  if (sites.length) box.append(el("div", { class: "reslabel" }, "Read · websites"),
    el("div", { class: "chips" }, sites.map(([t, u]) => el("a", { class: "chip", href: u, target: "_blank", rel: "noopener" }, t))));
  return box;
}
let modal = null, lastFocus = null;
function openVideo(v) {
  lastFocus = document.activeElement;
  if (!modal) {
    modal = el("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title", hidden: true },
      el("div", { class: "modal-back", onclick: closeVideo }),
      el("div", { class: "modal-box" },
        el("div", { class: "modal-head" }, el("h3", { id: "modal-title" }), el("button", { type: "button", class: "modal-x", "aria-label": "Close video", onclick: closeVideo }, "×")),
        el("div", { class: "frame" }),
        el("div", { class: "modal-foot" }, el("span", {}, "Video not playing?"), el("a", { class: "yt-link", target: "_blank", rel: "noopener" }, "Watch on YouTube"))));
    document.body.append(modal);
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeVideo(); });
  }
  modal.querySelector("#modal-title").textContent = v.t;
  modal.querySelector(".yt-link").href = `https://www.youtube.com/watch?v=${v.id}`;
  modal.querySelector(".frame").replaceChildren(el("iframe", { src: `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1`, title: v.t, allow: "autoplay; encrypted-media; picture-in-picture; fullscreen", allowfullscreen: true }));
  modal.hidden = false; document.body.style.overflow = "hidden";
  modal.querySelector(".modal-x").focus();
}
function closeVideo() {
  if (!modal) return;
  modal.hidden = true; modal.querySelector(".frame").replaceChildren(); document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

function refresh() {
  let done = 0, total = 0;
  document.querySelectorAll(".tick").forEach(b => {
    const w = +b.dataset.w; total += w;
    b.checked = !!st.ticks[b.dataset.key];
    if (b.checked) done += w;
    b.closest(".block").classList.toggle("checked", b.checked);
  });
  $("#pnum").innerHTML = `${done}<small> / ${total}</small>`;
  $("#pbar").style.width = (total ? done / total * 100 : 0) + "%";
  document.querySelectorAll(".day").forEach(c => {
    let t = 0, dn = 0;
    c.querySelectorAll(".tick").forEach(b => { t += +b.dataset.w; if (b.checked) dn += +b.dataset.w; });
    c.querySelector("[data-count]").textContent = dn === t ? "Done" : `${dn} / ${t}`;
    c.classList.toggle("complete", dn === t);
    const s = document.querySelector(`.d[data-day="${c.id}"]`);
    if (s) s.classList.toggle("done", dn === t);
  });
}

function todayLine() {
  const iso = todayISO();
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const days = Math.round((MOCKS - now) / 86400000);
  const until = days > 0 ? ` <b>${days} days</b> until the mocks start.` : "";
  const today = studyDays.find(d => d.date === iso);
  const next = studyDays.find(d => d.date > iso);
  let msg;
  if (today) msg = `Today is a revision day: <b>${today.name}</b>.`;
  else if (next && iso < studyDays[0].date) msg = `The plan starts on <b>${next.name}</b>.`;
  else if (next && iso >= "2026-10-28" && iso <= "2026-10-31") msg = `Enjoy the trip. Next session: <b>${next.name}</b>.`;
  else if (next) msg = `Day off. Next session: <b>${next.name}</b>.`;
  else msg = `Plan complete. Keep using the quizzes and your tracker.`;
  $("#today-line").innerHTML = msg + until;
}

/* ---------- QUIZZES ---------- */
let quiz = null;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function renderQuizGrid() {
  const g = $("#quizgrid"); g.innerHTML = "";
  Object.keys(QUIZZES).forEach(s => {
    const best = st.best[s];
    g.append(el("button", { type: "button", class: "qcard", style: `--c:${col(s)}`, onclick: () => startQuiz(s) },
      el("strong", {}, SUBJECTS[s].name),
      el("span", {}, `${Math.min(8, QUIZZES[s].length)} questions`),
      el("span", { class: "best" }, best ? `Best: ${best.score} / ${best.total}` : "Not tried yet")));
  });
}

function startQuiz(s) {
  const qs = shuffle(QUIZZES[s]).slice(0, 8).map(q => {
    const order = shuffle(q.a.map((_, i) => i));
    return { ...q, order };
  });
  quiz = { s, qs, i: 0, score: 0, missed: [] };
  const box = $("#quizbox"); box.hidden = false; box.style.setProperty("--c", col(s));
  showQuestion();
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showQuestion() {
  const box = $("#quizbox"); box.innerHTML = "";
  const { s, qs, i } = quiz; const q = qs[i];
  box.append(el("div", { class: "qhead" }, el("div", { class: "label", style: `color:${col(s)}` }, `${SUBJECTS[s].name} quiz`), el("div", { class: "qprog" }, `Question ${i + 1} of ${qs.length} · Score ${quiz.score}`)));
  box.append(el("div", { class: "qtext" }, q.q));
  const answers = el("div", { class: "answers" });
  const fb = el("div", { class: "feedback", hidden: true, role: "status" });
  const next = el("button", { type: "button", class: "btn", hidden: true, onclick: () => { quiz.i++; quiz.i < qs.length ? showQuestion() : finishQuiz(); } }, i + 1 < qs.length ? "Next question" : "See my score");
  q.order.forEach(idx => {
    const btn = el("button", { type: "button", class: "ans" }, q.a[idx]);
    btn.addEventListener("click", () => {
      answers.querySelectorAll(".ans").forEach(b => b.disabled = true);
      const right = idx === q.c;
      btn.classList.add(right ? "right" : "wrong");
      if (!right) answers.children[q.order.indexOf(q.c)].classList.add("right");
      if (right) quiz.score++;
      else recordMiss(s, q);
      fb.className = `feedback ${right ? "ok" : "no"}`;
      fb.replaceChildren(el("b", {}, right ? "Correct" : `Not quite. The answer is: ${q.a[q.c]}`), q.why);
      fb.hidden = false; next.hidden = false; next.focus();
    });
    answers.append(btn);
  });
  box.append(answers, fb, next);
}

function recordMiss(s, q) {
  quiz.missed.push(q);
  const k = topicKey(s, q.t);
  st.missed[k] = (st.missed[k] || 0) + 1;
  if (!st.rag[k] || st.rag[k] === "g") st.rag[k] = "a";
  st.log = st.log.filter(r => r.d || r.s || r.w);
  st.log.unshift({ d: todayShort(), s, w: `Quiz: ${q.q} Answer: ${q.a[q.c]}`, f: false });
  save();
}

function finishQuiz() {
  const { s, qs, score, missed } = quiz;
  const prev = st.best[s];
  if (!prev || score / qs.length >= prev.score / prev.total) st.best[s] = { score, total: qs.length };
  save();
  const box = $("#quizbox"); box.innerHTML = "";
  const pct = score / qs.length;
  const verdict = pct === 1 ? "Perfect. You know this." : pct >= 0.75 ? "Strong. Just tidy up the ones you missed." : pct >= 0.5 ? "Getting there. Go back over the topics below." : "This one needs work. Make it a priority.";
  box.append(el("div", { class: "label", style: `color:${col(s)}` }, `${SUBJECTS[s].name} quiz`),
    el("div", { class: "score" }, `${score} / ${qs.length}`), el("p", { class: "lead" }, verdict));
  if (missed.length) {
    box.append(el("p", { class: "small" }, "These are now in your mistake log, and the topics are flagged in your tracker:"),
      el("ul", { class: "reviewlist" }, missed.map(q => el("li", {}, el("b", {}, q.t + ": "), `${q.q} Answer: ${q.a[q.c]}`))));
  }
  box.append(el("div", { class: "row-actions" },
    missed.length ? el("button", { type: "button", class: "btn ghost", onclick: e => { missed.forEach(q => addCard(s, q.q, `${q.a[q.c]}. ${q.why}`, { fromQuiz: true })); save(); renderFlash(); e.currentTarget.disabled = true; e.currentTarget.textContent = "Added to flashcards"; } }, `Make ${missed.length} flashcard${missed.length > 1 ? "s" : ""} from my mistakes`) : null,
    el("button", { type: "button", class: "btn", onclick: () => startQuiz(s) }, "Try again"),
    el("button", { type: "button", class: "btn ghost", onclick: () => { box.hidden = true; renderQuizGrid(); window.scrollTo({ top: 0, behavior: "smooth" }); } }, "Pick another subject")));
  renderQuizGrid(); renderTracker(); renderLog();
}

/* ---------- TRACKER ---------- */
let filter = "all";
const RAG = [["r", "Stuck", "var(--bad)"], ["a", "Getting there", "var(--warn)"], ["g", "Got it", "var(--good)"]];

function renderFilter() {
  const f = $("#filter"); f.innerHTML = "";
  [["all", "All topics"], ["r", "Red only"], ["a", "Amber only"], ["none", "Not rated"]].forEach(([v, t]) =>
    f.append(el("button", { type: "button", "aria-pressed": String(filter === v), onclick: () => { filter = v; renderFilter(); renderTracker(); } }, t)));
}

function renderTracker() {
  const box = $("#topics"); box.innerHTML = "";
  let n = { r: 0, a: 0, g: 0, none: 0 };
  Object.entries(TOPICS).forEach(([s, list]) => {
    const rows = [];
    list.forEach(t => {
      const k = topicKey(s, t); const r = st.rag[k] || "none"; n[r]++;
      if (filter !== "all" && filter !== r) return;
      const rag = el("div", { class: "rag", role: "group", "aria-label": `Rate ${t}` },
        RAG.map(([v, label, c]) => el("button", { type: "button", title: label, "aria-label": label, "aria-pressed": String(st.rag[k] === v), style: `--rc:${c}`,
          onclick: () => { st.rag[k] = st.rag[k] === v ? undefined : v; if (!st.rag[k]) delete st.rag[k]; save(); renderTracker(); } })));
      const note = el("input", { type: "text", class: "note", id: `note-${k}`, placeholder: "What's confusing? (optional)", value: st.notes[k] || "" });
      note.addEventListener("input", () => { st.notes[k] = note.value; save(); });
      rows.push(el("div", { class: "topic" },
        el("div", { class: "tname" }, t, st.missed[k] ? el("small", {}, `Missed ${st.missed[k]} in quizzes`) : null),
        rag, note));
    });
    if (rows.length) box.append(el("section", { class: "subjectbox", style: `--c:${col(s)}` }, el("h3", {}, SUBJECTS[s].name), rows));
  });
  if (!box.children.length) box.append(el("p", { class: "small", style: "text-align:center" }, "No topics match this filter."));
  $("#ragsum").replaceChildren(
    el("span", {}, el("i", { style: "background:var(--bad)" }), `${n.r} stuck`),
    el("span", {}, el("i", { style: "background:var(--warn)" }), `${n.a} getting there`),
    el("span", {}, el("i", { style: "background:var(--good)" }), `${n.g} got it`),
    el("span", {}, el("i", { style: "background:var(--line)" }), `${n.none} not rated`));
}

function renderQuestions() {
  const box = $("#questions"); box.innerHTML = "";
  if (!st.qs.length) box.append(el("p", { class: "small" }, "Nothing yet. Add anything you want to ask a teacher."));
  st.qs.forEach((q, i) => {
    const done = el("input", { type: "checkbox", id: `q-done-${i}`, "aria-label": "Asked", checked: q.done || false });
    done.addEventListener("change", () => { q.done = done.checked; save(); });
    const txt = el("input", { type: "text", id: `q-text-${i}`, value: q.t || "", placeholder: "e.g. How do I find the nth term of a quadratic sequence?" });
    txt.addEventListener("input", () => { q.t = txt.value; save(); });
    box.append(el("div", { class: "qrow" }, done, txt, el("button", { type: "button", class: "del", "aria-label": "Remove question", onclick: () => { st.qs.splice(i, 1); save(); renderQuestions(); } }, "×")));
  });
}

function renderLog() {
  const body = $("#logbody"); body.innerHTML = "";
  if (!st.log.length) st.log.push({ d: "", s: "", w: "", f: false });
  st.log.forEach((r, i) => {
    const d = el("input", { type: "text", id: `log-d-${i}`, "aria-label": "Date", value: r.d || "", placeholder: "dd/mm" });
    const s = el("select", { id: `log-s-${i}`, "aria-label": "Subject" }, el("option", { value: "" }, "Choose…"),
      Object.entries(SUBJECTS).map(([k, v]) => el("option", { value: k, selected: r.s === k }, v.name)));
    const w = el("input", { type: "text", id: `log-w-${i}`, "aria-label": "What I got wrong", value: r.w || "" });
    const f = el("input", { type: "checkbox", id: `log-f-${i}`, "aria-label": "Fixed", checked: !!r.f });
    d.oninput = () => { r.d = d.value; save(); }; s.onchange = () => { r.s = s.value; save(); };
    w.oninput = () => { r.w = w.value; save(); }; f.onchange = () => { r.f = f.checked; save(); };
    body.append(el("tr", {}, el("td", { style: "width:80px" }, d), el("td", { style: "width:150px" }, s), el("td", {}, w), el("td", { class: "c" }, f),
      el("td", { class: "c" }, el("button", { type: "button", class: "del", "aria-label": "Remove row", onclick: () => { st.log.splice(i, 1); save(); renderLog(); } }, "×"))));
  });
}

/* ---------- LINKS ---------- */
function renderLinks() {
  const g = $("#linkgrid");
  LINKS.forEach(([title, list]) => g.append(el("section", { class: "linkset" }, el("h3", {}, title),
    el("ul", {}, list.map(([t, u]) => el("li", {}, el("a", { href: u, target: "_blank", rel: "noopener" }, t)))))));
}

/* ---------- BACKUP ---------- */
function wireBackup() {
  const msg = $("#backup-msg");
  $("#export").onclick = () => {
    const blob = new Blob([JSON.stringify(st, null, 2)], { type: "application/json" });
    const a = el("a", { href: URL.createObjectURL(blob), download: `harriet-revision-backup-${todayISO()}.json` });
    document.body.append(a); a.click(); a.remove();
    msg.textContent = "Backup downloaded.";
  };
  $("#import").onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try { const data = JSON.parse(r.result); if (!data || typeof data !== "object" || !data.ticks) throw 0;
        st = Object.assign(blank(), data); save(); renderAll(); msg.textContent = "Backup restored."; }
      catch (err) { msg.textContent = "That file isn't a backup from this site. Choose the .json file you downloaded."; }
    };
    r.readAsText(file); e.target.value = "";
  };
  const reset = $("#reset");
  reset.onclick = () => {
    if (reset.dataset.armed) { st = blank(); save(); renderAll(); reset.textContent = "Clear everything"; delete reset.dataset.armed; msg.textContent = "Everything cleared."; }
    else { reset.dataset.armed = "1"; reset.textContent = "Tap again to clear everything"; setTimeout(() => { reset.textContent = "Clear everything"; delete reset.dataset.armed; }, 4000); }
  };
  $("#print-plan").onclick = () => window.print();
  $("#add-q").onclick = () => { st.qs.push({ t: "", done: false }); save(); renderQuestions(); document.getElementById(`q-text-${st.qs.length - 1}`).focus(); };
  $("#add-log").onclick = () => { st.log.push({ d: todayShort(), s: "", w: "", f: false }); save(); renderLog(); document.getElementById(`log-w-${st.log.length - 1}`).focus(); };
}

/* ---------- FLASHCARDS ---------- */
const GAPS = [0, 1, 2, 4, 7, 14]; // days until a card comes back, by box
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
let deck = "all", study = null, editing = null;
const isDue = c => !c.due || c.due <= todayISO();
const inDeck = c => deck === "all" || c.s === deck;

function addCard(s, f, b, extra = {}) {
  st.cards.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), s, f: f.trim(), b: b.trim(), box: 0, due: todayISO(), ...extra });
}

function renderFlash() {
  const cards = st.cards;
  const due = cards.filter(c => inDeck(c) && isDue(c)).length;
  const inThis = cards.filter(inDeck).length;
  const today = (st.studyLog || {})[todayISO()] || 0;
  $("#fc-stats").replaceChildren(
    el("span", {}, el("b", {}, String(cards.length)), " cards"),
    el("span", {}, el("b", {}, String(cards.filter(isDue).length)), " due today"),
    el("span", {}, el("b", {}, String(today)), " reviewed today"));
  const decks = $("#fc-decks"); decks.innerHTML = "";
  [["all", "All subjects"], ...Object.entries(SUBJECTS).map(([k, v]) => [k, v.name])].forEach(([k, name]) => {
    const n = k === "all" ? cards.length : cards.filter(c => c.s === k).length;
    decks.append(el("button", { type: "button", "aria-pressed": String(deck === k), style: k === "all" ? "" : `--c:${col(k)}`, onclick: () => { deck = k; renderFlash(); } }, name, el("small", {}, String(n))));
  });
  $("#fc-study").textContent = due ? `Study ${due} due card${due > 1 ? "s" : ""}` : "Nothing due. Well done.";
  $("#fc-study").disabled = !due;
  $("#fc-cram").disabled = !inThis;
  const sel = $("#fc-subject"); if (!sel.options.length) Object.entries(SUBJECTS).forEach(([k, v]) => sel.append(el("option", { value: k }, v.name)));
  if (deck !== "all") sel.value = deck;
  // starter packs
  const packs = $("#fc-packs"); packs.innerHTML = "";
  Object.entries(STARTERS).forEach(([k, p]) => {
    const s = p.subject || k;
    if (deck !== "all" && deck !== s) return;
    const added = cards.some(c => c.pack === k);
    packs.append(el("button", { type: "button", class: "pack", style: `--c:${col(s)}`, disabled: added,
      onclick: () => { p.cards.forEach(([f, b]) => addCard(s, f, b, { pack: k })); save(); renderFlash(); toast(`Added ${p.cards.length} cards: ${p.name}`); } },
      el("strong", {}, p.name), el("span", {}, added ? "Added" : `${p.cards.length} cards · tap to add`)));
  });
  // card list
  const list = $("#fc-list"); list.innerHTML = "";
  const shown = cards.filter(inDeck).slice().reverse();
  if (!shown.length) list.append(el("p", { class: "small" }, "No cards here yet. Make one above, or add a starter pack."));
  shown.forEach(c => {
    if (editing === c.id) {
      const f = el("textarea", { id: `ed-f-${c.id}`, rows: 2, "aria-label": "Front" }, c.f);
      const b = el("textarea", { id: `ed-b-${c.id}`, rows: 2, "aria-label": "Back" }, c.b);
      list.append(el("div", { class: "fcrow editing", style: `--c:${col(c.s)}` }, f, b,
        el("div", { class: "row-actions" },
          el("button", { type: "button", class: "btn", onclick: () => { if (f.value.trim() && b.value.trim()) { c.f = f.value.trim(); c.b = b.value.trim(); } editing = null; save(); renderFlash(); } }, "Save"),
          el("button", { type: "button", class: "btn ghost", onclick: () => { editing = null; renderFlash(); } }, "Cancel"))));
      return;
    }
    const level = ["New", "Learning", "Learning", "Getting there", "Strong", "Mastered"][Math.min(c.box, 5)];
    list.append(el("div", { class: "fcrow", style: `--c:${col(c.s)}` },
      el("div", { class: "fcq" }, el("b", {}, c.f), el("span", {}, c.b)),
      el("div", { class: "fcmeta" }, el("span", { class: "lvl" }, level),
        el("button", { type: "button", class: "del", "aria-label": "Edit card", title: "Edit", onclick: () => { editing = c.id; renderFlash(); } }, "✎"),
        el("button", { type: "button", class: "del", "aria-label": "Delete card", title: "Delete", onclick: () => { st.cards = st.cards.filter(x => x.id !== c.id); save(); renderFlash(); } }, "×"))));
  });
}

function toast(msg) {
  let t = $("#toast"); if (!t) { t = el("div", { id: "toast", role: "status" }); document.body.append(t); }
  t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
}

function startStudy(all) {
  const pool = st.cards.filter(c => inDeck(c) && (all || isDue(c)));
  if (!pool.length) return;
  study = { queue: shuffle(pool).map(c => c.id), done: 0, right: 0, total: pool.length, flipped: false, cram: all };
  $("#fc-home").hidden = true; $("#fc-session").hidden = false;
  showCard();
}

function showCard() {
  const box = $("#fc-session"); box.innerHTML = "";
  if (!study.queue.length) {
    box.append(el("div", { class: "label" }, "Session complete"),
      el("div", { class: "score", style: "color:var(--accent)" }, `${study.right} / ${study.total}`),
      el("p", { class: "lead" }, study.right === study.total ? "You knew every card first time." : "Cards you didn't know will come back sooner."),
      el("div", { class: "row-actions" }, el("button", { type: "button", class: "btn", onclick: endStudy }, "Back to my cards")));
    return;
  }
  const c = st.cards.find(x => x.id === study.queue[0]);
  if (!c) { study.queue.shift(); return showCard(); }
  study.flipped = false;
  const card = el("button", { type: "button", class: "flip", style: `--c:${col(c.s)}`, "aria-label": "Flip card" },
    el("span", { class: "face front" }, el("small", {}, SUBJECTS[c.s].name), el("span", { class: "ftext" }, c.f), el("em", {}, "Tap to flip")),
    el("span", { class: "face back" }, el("small", {}, "Answer"), el("span", { class: "ftext" }, c.b)));
  const actions = el("div", { class: "judge", hidden: true },
    el("button", { type: "button", class: "btn no", onclick: () => judge(c, false) }, "Not yet"),
    el("button", { type: "button", class: "btn yes", onclick: () => judge(c, true) }, "Knew it"));
  const flip = () => { study.flipped = !study.flipped; card.classList.toggle("on", study.flipped); if (study.flipped) actions.hidden = false; };
  card.addEventListener("click", flip);
  box.append(el("div", { class: "qhead" }, el("div", { class: "label" }, study.cram ? "Practising every card" : "Due cards"),
      el("div", { class: "qprog" }, `${study.queue.length} left · ${study.right} known`)),
    card, actions,
    el("button", { type: "button", class: "linkbtn", onclick: endStudy }, "Stop and go back"));
  box.onkeydown = null;
  card.focus();
}

function judge(c, knew) {
  const id = study.queue.shift();
  st.studyLog = st.studyLog || {}; st.studyLog[todayISO()] = (st.studyLog[todayISO()] || 0) + 1;
  if (knew) {
    if (!c._missed) study.right++;
    c.box = Math.min((c.box || 0) + 1, 5); c.due = addDays(GAPS[c.box]);
  } else {
    c.box = 1; c.due = todayISO(); c._missed = true;
    study.queue.push(id); // see it again this session
  }
  save(); showCard();
}

function endStudy() {
  st.cards.forEach(c => delete c._missed); save();
  study = null; $("#fc-session").hidden = true; $("#fc-home").hidden = false; renderFlash();
}

function wireFlash() {
  $("#fc-form").addEventListener("submit", e => {
    e.preventDefault();
    const f = $("#fc-front"), b = $("#fc-back");
    if (!f.value.trim() || !b.value.trim()) { toast("Fill in both sides of the card."); return; }
    addCard($("#fc-subject").value, f.value, b.value);
    f.value = ""; b.value = ""; save(); renderFlash(); toast("Card added."); f.focus();
  });
  $("#fc-study").onclick = () => startStudy(false);
  $("#fc-cram").onclick = () => startStudy(true);
  document.addEventListener("keydown", e => {
    if (!study || $("#fc-session").hidden || /input|textarea/i.test(e.target.tagName)) return;
    const card = $("#fc-session .flip"); if (!card) return;
    if (e.key === " " || e.key === "Enter") { if (document.activeElement !== card) { e.preventDefault(); card.click(); } }
    if (study.flipped && e.key === "1") $("#fc-session .no").click();
    if (study.flipped && e.key === "2") $("#fc-session .yes").click();
  });
}

/* ---------- TABS ---------- */
const TABS = ["plan", "quiz", "cards", "tracker", "links"];
function route() {
  const h = location.hash.slice(1);
  const tab = TABS.includes(h) ? h : "plan";
  TABS.forEach(t => {
    $(`#tab-${t}`).hidden = t !== tab;
    document.querySelector(`[data-tab="${t}"]`).setAttribute("aria-selected", String(t === tab));
  });
  if (h && !TABS.includes(h)) { const d = document.getElementById(h); if (d) d.scrollIntoView({ behavior: "smooth", block: "start" }); }
}

function renderAll() {
  ["#hours", "#strip", "#days"].forEach(s => $(s).innerHTML = "");
  renderHours(); renderStrip(); renderDays(); refresh(); todayLine();
  renderQuizGrid(); renderFilter(); renderTracker(); renderQuestions(); renderLog(); renderFlash();
}

renderAll(); renderLinks(); wireBackup(); wireFlash(); route();
window.addEventListener("hashchange", route);
})();
