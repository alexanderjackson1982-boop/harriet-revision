(() => {
"use strict";

const KEY = "harriet-mocks-site-v1";
const MOCKS = new Date(2026, 10, 9); // 9 November 2026
const blank = () => ({ ticks: {}, rag: {}, notes: {}, missed: {}, best: {}, log: [], qs: [], cards: [], studyLog: {}, attempts: {}, retry: {}, perf: {}, skills: [], drafts: {}, qcheck: {}, ai: {} });
/* Make any saved or restored data safe to use: keep what's valid, fill in anything missing. */
function normalise(raw) {
  const out = blank();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  const isObj = v => v && typeof v === "object" && !Array.isArray(v);
  for (const k of Object.keys(out)) {
    if (Array.isArray(out[k])) { if (Array.isArray(raw[k])) out[k] = raw[k].filter(x => x && typeof x === "object"); }
    else if (isObj(raw[k])) out[k] = raw[k];
  }
  out.log.forEach(r => { if (typeof r.r !== "string") r.r = ""; });
  return out;
}
let st = blank();
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) st = normalise(s); } catch (e) {}
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
    learning: (() => { const f = Object.values(st.attempts).flat(); const r = Object.values(st.attempts).filter(a => a.length > 1); return { attempted: f.length, marks: f.reduce((n, a) => n + a.score, 0), max: f.reduce((n, a) => n + a.max, 0), improved: r.filter(a => a[a.length - 1].score > a[0].score).length, retried: r.length, toRetry: Object.keys(st.retry).length }; })(),
    coverage: coverage().filter(c => c.done).map(c => `${c.title}: ${c.done}/${c.total}`),
    errorTypes: errorTypeCounts().filter(e => e.n).map(e => `${e.name}: ${e.n}`),
    aiMarked: Object.values(st.ai).reduce((n, a) => n + a.length, 0),
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
          typeof FOCUS !== "undefined" && FOCUS[key] ? el("p", { class: "focusline" }, el("b", {}, "Teacher focus"), FOCUS[key],
            FOCUS_MOD[key] ? el("button", { type: "button", class: "linkbtn", onclick: () => openModule(FOCUS_MOD[key]) }, " Practise this →") : null) : null,
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

const FOCUS_MOD = { "tue20-1": "chem", "wed21-1": "sci", "wed21-2": "eng", "thu22-1": "bio", "fri23-1": "chem", "fri23-2": "eng", "mon26-0": "sci", "tue27-0": "sci", "sun1-1": "sci" };
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
  const until = "";
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
      if (right) { quiz.score++; recordPerf(s, q.t, 1); save(); }
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
  recordPerf(s, q.t, 0);
  st.log = st.log.filter(r => r.d || r.s || r.w);
  st.log.unshift({ d: todayShort(), s, w: `Quiz: ${q.q} Answer: ${q.a[q.c]}`, r: "knowledge", f: false });
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
    box.append(el("p", { class: "small" }, "These are now in your mistake log, and count towards that topic's performance in your tracker:"),
      el("ul", { class: "reviewlist" }, missed.map(q => el("li", {}, el("b", {}, q.t + ": "), `${q.q} Answer: ${q.a[q.c]}`))));
  }
  box.append(el("div", { class: "row-actions" },
    missed.length ? el("button", { type: "button", class: "btn ghost", onclick: e => { missed.forEach(q => addCard(s, q.q, `${q.a[q.c]}. ${q.why}`, { fromQuiz: true })); save(); renderFlash(); e.currentTarget.disabled = true; e.currentTarget.textContent = "Added to flashcards"; } }, `Make ${missed.length} flashcard${missed.length > 1 ? "s" : ""} from my mistakes`) : null,
    el("button", { type: "button", class: "btn", onclick: () => startQuiz(s) }, "Try again"),
    el("button", { type: "button", class: "btn ghost", onclick: () => { box.hidden = true; renderQuizGrid(); window.scrollTo({ top: 0, behavior: "smooth" }); } }, "Pick another subject")));
  renderQuizGrid(); renderTracker(); renderLog(); renderProgress();
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
      const p = perfStats(k), conf = st.rag[k];
      let perf = null, flag = null;
      if (p.n) {
        const pct = Math.round(p.avg * 100);
        perf = el("span", { class: `perfchip ${p.recent < 3 ? "few" : pct >= 75 ? "hi" : pct >= 50 ? "mid" : "lo"}` }, p.recent < 3 ? `${p.n} answer${p.n > 1 ? "s" : ""} so far` : `Recent answers: ${pct}%`);
        if (p.recent >= 3 && conf === "g" && p.avg < 0.6) flag = el("small", { class: "flag" }, "You feel confident here, but recent answers are losing marks. Worth one more look.");
        if (p.recent >= 3 && conf === "r" && p.avg >= 0.8) flag = el("small", { class: "flag good" }, "Your answers are stronger than you think. Keep going.");
      }
      rows.push(el("div", { class: "topic" },
        el("div", { class: "tname" }, t, perf, flag),
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
    const why = el("select", { id: `log-r-${i}`, "aria-label": "Why I lost marks" }, el("option", { value: "" }, "Why?"),
      Object.entries(REASONS).map(([k, v]) => el("option", { value: k, selected: r.r === k }, v)));
    why.onchange = () => { r.r = why.value; save(); renderProgress(); };
    const f = el("input", { type: "checkbox", id: `log-f-${i}`, "aria-label": "Fixed", checked: !!r.f });
    d.oninput = () => { r.d = d.value; save(); }; s.onchange = () => { r.s = s.value; save(); };
    w.oninput = () => { r.w = w.value; save(); }; f.onchange = () => { r.f = f.checked; save(); renderProgress(); };
    body.append(el("tr", {}, el("td", { style: "width:80px" }, d), el("td", { style: "width:140px" }, s), el("td", {}, w), el("td", { style: "width:170px" }, why), el("td", { class: "c" }, f),
      el("td", { class: "c" }, el("button", { type: "button", class: "del", "aria-label": "Remove row", onclick: () => { st.log.splice(i, 1); save(); renderLog(); renderProgress(); } }, "×"))));
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
    const blob = new Blob([JSON.stringify({ app: "harriet-mocks", version: 2, exportedAt: new Date().toISOString(), data: st }, null, 2)], { type: "application/json" });
    const a = el("a", { href: URL.createObjectURL(blob), download: `harriet-revision-backup-${todayISO()}.json` });
    document.body.append(a); a.click(); a.remove();
    msg.textContent = "Backup downloaded.";
  };
  $("#import").onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      let data;
      try { const raw = JSON.parse(r.result); data = raw && raw.app === "harriet-mocks" && raw.data ? raw.data : raw; if (!data || typeof data !== "object" || !("ticks" in data)) throw 0; }
      catch (err) { msg.textContent = "That file isn't a backup from this site, so nothing was changed. Choose the .json file you downloaded."; return; }
      const incoming = normalise(data);
      const count = o => `${Object.values(o.ticks).filter(Boolean).length} blocks ticked, ${o.cards.length} flashcards, ${Object.values(o.attempts).flat().length} practice answers`;
      const box = $("#restore-confirm"); box.hidden = false;
      box.replaceChildren(el("p", {}, el("b", {}, "Replace your current progress with this backup?")),
        el("p", { class: "small" }, `Now: ${count(st)}.`), el("p", { class: "small" }, `Backup: ${count(incoming)}.`),
        el("div", { class: "row-actions" },
          el("button", { type: "button", class: "btn", onclick: () => {
            try { localStorage.setItem(KEY + "-before-restore", JSON.stringify(st)); } catch (e) {}
            st = incoming; save(); renderAll(); box.hidden = true; msg.textContent = "Backup restored. Your previous progress was kept, so you can undo this."; $("#undo-restore").hidden = false; } }, "Yes, restore it"),
          el("button", { type: "button", class: "btn ghost", onclick: () => { box.hidden = true; msg.textContent = "Restore cancelled. Nothing changed."; } }, "Cancel")));
    };
    r.readAsText(file); e.target.value = "";
  };
  $("#undo-restore").onclick = () => {
    try { const prev = JSON.parse(localStorage.getItem(KEY + "-before-restore")); if (prev) { st = normalise(prev); save(); renderAll(); msg.textContent = "Restore undone."; $("#undo-restore").hidden = true; } } catch (e) { msg.textContent = "Couldn't undo the restore."; }
  };
  try { if (localStorage.getItem(KEY + "-before-restore")) $("#undo-restore").hidden = false; } catch (e) {}
  const reset = $("#reset");
  reset.onclick = () => {
    if (reset.dataset.armed) { try { localStorage.setItem(KEY + "-before-restore", JSON.stringify(st)); } catch (e) {} st = blank(); save(); $("#undo-restore").hidden = false; renderAll(); reset.textContent = "Clear everything"; delete reset.dataset.armed; msg.textContent = "Everything cleared."; }
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
      p.focus ? el("em", { class: "fbadge" }, "From school feedback") : null,
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
  $("#fc-print").onclick = printCards;
  document.addEventListener("keydown", e => {
    if (!study || $("#fc-session").hidden || /input|textarea/i.test(e.target.tagName)) return;
    const card = $("#fc-session .flip"); if (!card) return;
    if (e.key === " " || e.key === "Enter") { if (document.activeElement !== card) { e.preventDefault(); card.click(); } }
    if (study.flipped && e.key === "1") $("#fc-session .no").click();
    if (study.flipped && e.key === "2") $("#fc-session .yes").click();
  });
}


/* ---------- FOCUS PANEL (school feedback) ---------- */
function renderFocus() {
  if (typeof FOCUS_AREAS === "undefined") return;
  const box = $("#focus"); if (!box) return; box.innerHTML = "";
  const col2 = (title, items, packs, cssv) => {
    const ready = packs.every(k => st.cards.some(c => c.pack === k));
    return el("div", { class: "fcol", style: `--c:var(${cssv})` }, el("h3", {}, title),
      el("ul", {}, items.map(t => el("li", {}, t))),
      el("button", { type: "button", class: "btn", onclick: () => {
        packs.forEach(k => { if (!st.cards.some(c => c.pack === k)) { const p = STARTERS[k]; p.cards.forEach(([f, b]) => addCard(p.subject || k, f, b, { pack: k })); } });
        save(); deck = "all"; renderFlash(); renderFocus(); location.hash = "cards"; toast("Focus flashcards are ready.");
      } }, ready ? "Study these flashcards" : "Add these flashcards"));
  };
  box.append(col2("Science", FOCUS_AREAS.science, ["sciSkills", "disease", "bonding"], "--bio"), col2("English", FOCUS_AREAS.english, ["analysis"], "--eng"));
}

/* ---------- PRINT FLASHCARDS (A4) ---------- */
function printCards() {
  const cards = st.cards.filter(inDeck);
  if (!cards.length) { toast("No cards to print in this subject yet."); return; }
  const layout = $("#fc-layout").value;
  const title = deck === "all" ? "All subjects" : SUBJECTS[deck].name;
  const wrap = el("div", { id: "printcards" });
  const cell = (c, side) => el("div", { class: `pc ${side}`, style: `--c:var(${SUBJECTS[c.s] ? SUBJECTS[c.s].colour : "--accent"})` },
    el("small", {}, side === "q" ? SUBJECTS[c.s].name : "Answer"), el("div", { class: "pct" }, side === "q" ? c.f : c.b));
  if (layout === "fold") {
    for (let i = 0; i < cards.length; i += 7) {
      const page = el("section", { class: "ppage fold" }, el("header", {}, `Harriet's flashcards · ${title} · cut along the dashed lines, fold down the middle`));
      cards.slice(i, i + 7).forEach(c => page.append(el("div", { class: "prow" }, cell(c, "q"), cell(c, "a"))));
      wrap.append(page);
    }
  } else {
    for (let i = 0; i < cards.length; i += 8) {
      const set = cards.slice(i, i + 8);
      const front = el("section", { class: "ppage grid" }, el("header", {}, `Fronts · ${title} · print double-sided, flip on the long edge`));
      const back = el("section", { class: "ppage grid" }, el("header", {}, `Backs · ${title}`));
      const g1 = el("div", { class: "pgrid" }), g2 = el("div", { class: "pgrid" });
      for (let r = 0; r < 4; r++) {
        const a = set[r * 2], b = set[r * 2 + 1];
        g1.append(a ? cell(a, "q") : el("div", { class: "pc blank" }), b ? cell(b, "q") : el("div", { class: "pc blank" }));
        g2.append(b ? cell(b, "a") : el("div", { class: "pc blank" }), a ? cell(a, "a") : el("div", { class: "pc blank" })); // mirrored for the back
      }
      front.append(g1); back.append(g2); wrap.append(front, back);
    }
  }
  document.getElementById("printcards")?.remove();
  document.body.append(wrap); document.body.classList.add("print-cards");
  const done = () => { document.body.classList.remove("print-cards"); wrap.remove(); };
  window.addEventListener("afterprint", done, { once: true });
  setTimeout(() => { window.print(); }, 50);
}
/* ---------- PERFORMANCE (what she can do, separate from how confident she feels) ---------- */
function recordPerf(subj, topic, v) {
  if (!topic) return;
  const k = topicKey(subj, topic);
  (st.perf[k] = st.perf[k] || []).push({ d: todayISO(), v: Math.max(0, Math.min(1, v)) });
  if (st.perf[k].length > 30) st.perf[k] = st.perf[k].slice(-30);
}
function perfStats(k) {
  const list = st.perf[k] || [];
  const recent = list.slice(-6);
  const avg = recent.length ? recent.reduce((a, x) => a + x.v, 0) / recent.length : null;
  return { n: list.length, recent: recent.length, avg };
}

/* ---------- SMALL COMPONENTS ---------- */
function mcqBlock(item, subj) {
  const box = el("div", { class: "mcq" });
  const fb = el("p", { class: "mcqfb", hidden: true, role: "status" });
  box.append(el("p", { class: "mcqq" }, item.q));
  const opts = el("div", { class: "answers" });
  item.a.forEach((txt, i) => {
    const b = el("button", { type: "button", class: "ans" }, txt);
    b.onclick = () => {
      opts.querySelectorAll(".ans").forEach(x => x.disabled = true);
      const ok = i === item.c;
      b.classList.add(ok ? "right" : "wrong");
      if (!ok) opts.children[item.c].classList.add("right");
      fb.hidden = false; fb.className = `mcqfb ${ok ? "ok" : "no"}`;
      fb.replaceChildren(el("b", {}, ok ? "Correct. " : "Not quite. "), item.why);
      if (item.t && subj) { recordPerf(subj, item.t, ok ? 1 : 0); save(); }
    };
    opts.append(b);
  });
  box.append(opts, fb);
  return box;
}

function graphSVG(g) {
  const W = 520, H = 300, L = 56, R = 16, T = 16, B = 48;
  const sx = x => L + (x / g.xmax) * (W - L - R), sy = y => T + (1 - y / g.ymax) * (H - T - B);
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("class", "graph"); svg.setAttribute("role", "img"); svg.setAttribute("aria-label", g.title);
  const add = (tag, attrs, text) => { const n = document.createElementNS(ns, tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (text != null) n.textContent = text; svg.append(n); return n; };
  for (let y = 0; y <= g.ymax; y += g.ystep / 2) add("line", { x1: L, x2: W - R, y1: sy(y), y2: sy(y), class: y % g.ystep === 0 ? "gmaj" : "gmin" });
  for (let x = 0; x <= g.xmax; x += g.xstep / 2) add("line", { y1: T, y2: H - B, x1: sx(x), x2: sx(x), class: x % g.xstep === 0 ? "gmaj" : "gmin" });
  add("line", { x1: L, x2: W - R, y1: sy(0), y2: sy(0), class: "gaxis" }); add("line", { x1: L, x2: L, y1: T, y2: H - B, class: "gaxis" });
  for (let y = 0; y <= g.ymax; y += g.ystep) add("text", { x: L - 8, y: sy(y) + 4, "text-anchor": "end", class: "glab" }, String(y));
  for (let x = 0; x <= g.xmax; x += g.xstep) add("text", { x: sx(x), y: H - B + 18, "text-anchor": "middle", class: "glab" }, String(x));
  add("text", { x: (L + W - R) / 2, y: H - 8, "text-anchor": "middle", class: "gtitle" }, g.x);
  add("text", { x: 14, y: (T + H - B) / 2, "text-anchor": "middle", class: "gtitle", transform: `rotate(-90 14 ${(T + H - B) / 2})` }, g.y);
  add("polyline", { points: g.pts.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" "), class: "gline" });
  g.pts.forEach(([x, y]) => add("circle", { cx: sx(x), cy: sy(y), r: 4, class: "gdot" }));
  return el("figure", { class: "graphwrap" }, svg, el("figcaption", {}, g.title));
}

const fmtDate = iso => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };

function tableBlock(t) {
  return el("figure", { class: "datatable" }, el("table", {}, el("thead", {}, el("tr", {}, t.head.map(h => el("th", {}, h)))),
    el("tbody", {}, t.rows.map(r => el("tr", {}, r.map(c => el("td", {}, c)))))), el("figcaption", {}, t.title));
}
/* Step 1 of every question: what kind of answer does it want? */
function qtypeStep(q) {
  const right = q.type; if (!QTYPES[right]) return null;
  const pool = Object.keys(QTYPES).filter(k => k !== right);
  const h = [...q.id].reduce((n, c) => n + c.charCodeAt(0), 0);
  const opts = [right, pool[h % pool.length], pool[(h + 3) % pool.length]].filter((v, i, a) => a.indexOf(v) === i);
  const order = opts.map((v, i) => [v, (h * (i + 7)) % 11]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
  const box = el("details", { class: "qtype" }, el("summary", {}, "Before you write: what is this question asking for?"));
  const fb = el("p", { class: "mcqfb", hidden: true, role: "status" });
  const row = el("div", { class: "answers" });
  order.forEach(k => {
    const b = el("button", { type: "button", class: "ans" }, QTYPES[k][0]);
    b.onclick = () => {
      row.querySelectorAll(".ans").forEach(x => x.disabled = true);
      const ok = k === right; b.classList.add(ok ? "right" : "wrong");
      if (!ok) [...row.children][order.indexOf(right)].classList.add("right");
      fb.hidden = false; fb.className = `mcqfb ${ok ? "ok" : "no"}`;
      fb.replaceChildren(el("b", {}, ok ? "Yes. " : `It wants: ${QTYPES[right][0].toLowerCase()}. `), QTYPES[right][1], ` The command word is “${q.cmd}” and it's worth ${q.marks} mark${q.marks > 1 ? "s" : ""}.`);
      (st.qcheck[q.id] = st.qcheck[q.id] || []).push({ d: todayISO(), ok });
      save();
    };
    row.append(b);
  });
  box.append(row, fb);
  return box;
}

/* ---------- AI MARKING (optional, off unless switched on in the email script) ---------- */
const AI_CODE_KEY = "harriet-mocks-ai-code"; // kept apart from progress, so it never goes into backups or emails
let AI_ON = false;
const AI_TYPES = { knowledge: ["Knowledge", "knowledge"], understanding: ["Understanding", "explain"], application: ["Application", "apply"], analysis: ["Analysis", "analysis"], technique: ["Exam technique", "command"] };
const AI_ERRORS = {
  code: "That access code isn't right. Ask your dad for it.",
  daily_limit: "You've used today's AI marking. Use the marking guidance instead, and try again tomorrow.",
  total_limit: "AI marking has reached its limit for this revision period. The marking guidance still works.",
  too_long: "That answer is too long for AI marking. Trim it and try again.",
  empty: "Write an answer first.",
  off: "AI marking is switched off at the moment. Use the marking guidance below."
};
function checkAi() {
  if (!SYNC_URL) return;
  fetch(SYNC_URL + "?status=1").then(r => r.json()).then(j => { AI_ON = !!(j && j.ai === true); document.querySelectorAll(".aislot").forEach(sl => { const q = EXAMQ.find(x => x.id === sl.dataset.q); if (q) fillAiSlot(sl, q, document.getElementById(`xq-in-${q.id}`)); }); }).catch(() => {});
}
function aiContext(q) {
  if (q.source) return q.source;
  if (q.table && TABLES[q.table]) { const t = TABLES[q.table]; return `${t.title}\n${t.head.join(" | ")}\n${t.rows.map(r => r.join(" | ")).join("\n")}`; }
  if (q.graph && GRAPHS[q.graph]) { const g = GRAPHS[q.graph]; return `${g.title}. ${g.x} against ${g.y}. Points: ${g.pts.map(p => `(${p[0]}, ${p[1]})`).join(", ")}`; }
  return "";
}
function fillAiSlot(slot, q, input) {
  slot.innerHTML = "";
  if (!AI_ON || !input) return;
  const out = el("div", { class: "aifb", "aria-live": "polite" });
  const codeRow = el("div", { class: "aicode", hidden: true });
  const codeIn = el("input", { type: "password", id: `aicode-${q.id}`, autocomplete: "off", placeholder: "Access code", "aria-label": "AI marking access code" });
  codeRow.append(el("label", { for: `aicode-${q.id}`, class: "small" }, "Enter the access code once. It's saved on this device only."), codeIn,
    el("button", { type: "button", class: "btn ghost", onclick: () => { const v = codeIn.value.trim(); if (!v) return; try { localStorage.setItem(AI_CODE_KEY, v); } catch (e) {} codeRow.hidden = true; go(); } }, "Save and mark"));
  const btn = el("button", { type: "button", class: "btn ai", onclick: () => go() }, (st.ai[q.id] || []).length ? "Mark my improved answer with AI" : "Mark my answer with AI");
  slot.append(el("div", { class: "airow" }, btn, el("span", { class: "small" }, "Optional. AI feedback is an estimate to help you improve, not an official mark.")), codeRow, out);
  function go() {
    const answer = input.value.trim();
    if (!answer) { toast("Write your answer first."); input.focus(); return; }
    let code = ""; try { code = localStorage.getItem(AI_CODE_KEY) || ""; } catch (e) {}
    if (!code) { codeRow.hidden = false; codeIn.focus(); return; }
    const hist = st.ai[q.id] || [], last = hist[hist.length - 1];
    if (last && last.answer === answer) { toast("Change your answer first, then mark it again."); input.focus(); return; }
    const payload = { subject: SUBJECTS[q.subj].name, topic: q.topic, cmd: q.cmd, marks: q.marks, question: q.q, context: aiContext(q), guidance: q.guide, answer,
      previous: last ? { answer: last.answer } : null };
    btn.disabled = true; out.replaceChildren(el("p", { class: "small" }, "Reading your answer…"));
    const ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = setTimeout(() => ctl && ctl.abort(), 45000);
    fetch(SYNC_URL, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ key: SYNC_KEY, action: "mark", code, payload }), signal: ctl ? ctl.signal : undefined })
      .then(r => r.json()).then(res => {
        if (!res || !res.ok) {
          const e = res && res.error;
          if (e === "code") { try { localStorage.removeItem(AI_CODE_KEY); } catch (x) {} codeRow.hidden = false; }
          if (e === "off") AI_ON = false;
          out.replaceChildren(el("p", { class: "mcqfb no" }, AI_ERRORS[e] || "AI marking isn't available right now. Your answer is safe. Use the marking guidance below."));
          return;
        }
        const fb = res.feedback;
        const entry = { d: todayISO(), answer, mark: fb.mark, max: fb.max, markable: fb.markable, conf: fb.confidence, et: fb.error_types, accepted: [], rejected: [] };
        (st.ai[q.id] = hist).push(entry); if (hist.length > 6) hist.splice(0, hist.length - 6);
        save(); renderProgress();
        btn.textContent = "Mark my improved answer with AI";
        out.replaceChildren(aiFeedbackCard(q, fb, entry, input));
      })
      .catch(() => out.replaceChildren(el("p", { class: "mcqfb no" }, "AI marking isn't available right now. Your answer is safe. Use the marking guidance below.")))
      .finally(() => { clearTimeout(timer); btn.disabled = false; });
  }
}
function aiFeedbackCard(q, fb, entry, input) {
  const list = (title, items, cls) => items && items.length ? el("div", { class: `aisec ${cls || ""}` }, el("b", {}, title), el("ul", {}, items.map(t => el("li", {}, t)))) : null;
  const card = el("div", { class: "aicard" });
  card.append(el("div", { class: "aihead" }, el("span", { class: "aitag" }, "AI feedback"),
    fb.markable && fb.mark != null ? el("strong", {}, `Indicative mark: ${fb.mark} / ${fb.max}`) : el("strong", {}, "Feedback only (no reliable mark for this one)"),
    el("small", {}, ` AI estimate · ${fb.confidence} confidence`)));
  if (fb.compare) card.append(el("div", { class: "aisec compare" }, el("b", {}, fb.compare.better === "yes" ? "Compared with last time: this is stronger" : fb.compare.better === "no" ? "Compared with last time: not stronger yet" : "Compared with last time: about the same"),
    fb.compare.improved.length ? el("ul", {}, fb.compare.improved.map(t => el("li", {}, "Better: " + t))) : null,
    fb.compare.remaining.length ? el("ul", {}, fb.compare.remaining.map(t => el("li", {}, "Still to do: " + t))) : null));
  card.append(...[list("What you did well", fb.strengths, "good"), list("What is missing", fb.missing, "miss"), list("How to improve", fb.improve, "imp")].filter(Boolean));
  if (fb.criteria.length) card.append(el("details", { class: "aicrit" }, el("summary", {}, "Marking points the AI checked"),
    el("ul", {}, fb.criteria.map(c => el("li", { class: `met-${c.met}` }, `${c.met === "yes" ? "✓" : c.met === "partly" ? "◐" : "✗"} ${c.point}`)))));
  // AI-suggested weaknesses: Harriet decides
  if (fb.error_types.length) {
    const box = el("div", { class: "aisec types" }, el("b", {}, "The AI thinks you may have lost marks on:"), el("p", { class: "small" }, "Do you agree? Only the ones you agree with go into your mistake log."));
    fb.error_types.forEach(t => {
      const row = el("div", { class: "airow" }, el("span", {}, AI_TYPES[t][0]));
      const yes = el("button", { type: "button", class: "linkbtn", onclick: () => {
        entry.accepted.push(t); st.log = st.log.filter(r => r.d || r.s || r.w);
        st.log.unshift({ d: todayShort(), s: q.subj, w: `${q.cmd} (${q.marks}): ${q.q.slice(0, 80)}${q.q.length > 80 ? "…" : ""} AI-suggested, I agreed: ${AI_TYPES[t][0].toLowerCase()}.`, r: AI_TYPES[t][1], f: false, qid: q.id, src: "ai" });
        save(); renderLog(); renderProgress(); row.replaceChildren(el("span", { class: "small" }, `${AI_TYPES[t][0]}: added to your mistake log.`)); } }, "Yes, add it");
      const no = el("button", { type: "button", class: "linkbtn", onclick: () => { entry.rejected.push(t); save(); row.replaceChildren(el("span", { class: "small" }, `${AI_TYPES[t][0]}: ignored.`)); } }, "No");
      row.append(yes, no); box.append(row);
    });
    card.append(box);
  }
  const mdl = el("p", { class: "womodel", hidden: true }, el("b", {}, "Model answer: "), q.model);
  card.append(el("div", { class: "row-actions" },
    el("button", { type: "button", class: "btn", onclick: () => { input.focus(); input.scrollIntoView({ behavior: "smooth", block: "center" }); } }, "Try again: improve my answer"),
    el("button", { type: "button", class: "btn ghost", onclick: e => { mdl.hidden = false; e.target.remove(); } }, "Show me a model answer")), mdl,
    el("p", { class: "small" }, "AI can be wrong. If something doesn't match your notes or your teacher, trust them. You can still self-mark with the guidance below."));
  return card;
}

/* ---------- EXAM QUESTION (self-marked against guidance) ---------- */
function examQBlock(q) {
  const wrap = el("article", { class: "xq", id: `xq-${q.id}`, style: `--c:${col(q.subj)}` });
  const prev = st.attempts[q.id] || [];
  const prevLast = prev.length ? prev[prev.length - 1] : null;
  wrap.append(el("div", { class: "xqhead" },
    el("span", { class: "cmdchip" }, q.cmd), el("span", { class: "markchip" }, `${q.marks} mark${q.marks > 1 ? "s" : ""}`),
    st.retry[q.id] ? el("span", { class: "retrychip" }, st.retry[q.id] <= todayISO() ? "Ready to retry" : `Retry from ${fmtDate(st.retry[q.id])}`) : null));
  if (q.graph && GRAPHS[q.graph]) wrap.append(graphSVG(GRAPHS[q.graph]));
  if (q.table && TABLES[q.table]) wrap.append(tableBlock(TABLES[q.table]));
  if (q.source) wrap.append(el("blockquote", { class: "source" }, q.source));
  wrap.append(el("p", { class: "xqq" }, q.q));
  wrap.append(qtypeStep(q));
  if (prev.length) {
    const first = prev[0], last = prev[prev.length - 1];
    wrap.append(el("p", { class: "small xqprev" }, `Previous: ${prev.map(a => `${a.score}/${a.max}`).join(" → ")}`, last.score > first.score ? el("b", { class: "up" }, " Improved") : null));
  }
  let input;
  if (q.num) {
    input = el("input", { type: "text", inputmode: "decimal", id: `xq-in-${q.id}`, class: "xqnum", placeholder: "Your answer", "aria-label": "Your answer" });
    wrap.append(el("div", { class: "numrow" }, input, el("span", { class: "small" }, q.num.unit)));
  } else {
    input = el("textarea", { id: `xq-in-${q.id}`, rows: q.marks >= 4 ? 6 : 3, placeholder: "Write your answer here, as you would in the exam.", "aria-label": "Your answer" }, (st.drafts[q.id] || ""));
    input.addEventListener("input", () => { st.drafts[q.id] = input.value; save(); });
    wrap.append(input);
  }
  const panel = el("div", { class: "guide", hidden: true });
  const check = el("button", { type: "button", class: "btn", onclick: () => {
    if (!input.value.trim()) { toast("Have a go first. Write something, even if you're unsure."); input.focus(); return; }
    check.hidden = true; panel.hidden = false; buildGuide();
  } }, "Check against the marking guidance");
  wrap.append(check, panel);
  if (!q.num) { const slot = el("div", { class: "aislot", "data-q": q.id }); wrap.insertBefore(slot, check); fillAiSlot(slot, q, input); }

  function buildGuide() {
    panel.innerHTML = "";
    let autoScore = null;
    if (q.num) {
      const v = parseFloat(String(input.value).replace(/[£,\s]/g, ""));
      const ok = !isNaN(v) && Math.abs(v - q.num.ans) <= q.num.tol;
      autoScore = ok ? q.marks : 0;
      panel.append(el("p", { class: `mcqfb ${ok ? "ok" : "no"}` }, el("b", {}, ok ? "Correct. " : `Not quite. The answer is ${q.num.unit === "£" ? "£" : ""}${q.num.ans}${q.num.unit !== "£" ? " " + q.num.unit : ""}. `), q.model));
      if (!ok && q.marks > 1) panel.append(el("p", { class: "small" }, "In the real exam, correct working could still earn some of these marks. Tick any steps you got right below."));
    }
    panel.append(el("div", { class: "reslabel" }, q.num ? "Steps that earn marks" : "Tick each point your answer clearly makes. Be strict with yourself."));
    const boxes = q.guide.map((g, i) => {
      const cb = el("input", { type: "checkbox", id: `g-${q.id}-${i}` });
      if (autoScore === q.marks) cb.checked = true;
      return [cb, el("label", { class: "gitem", for: `g-${q.id}-${i}` }, cb, el("span", {}, g))];
    });
    panel.append(el("div", { class: "glist" }, boxes.map(b => b[1])));
    if (q.note) panel.append(el("p", { class: "small" }, q.note));
    panel.append(el("details", { class: "model" }, el("summary", {}, "Compare with a model answer"), el("p", {}, q.model)));
    if (q.mistakes) panel.append(el("div", { class: "mistakes" }, el("b", {}, "Common mistakes"), el("ul", {}, q.mistakes.map(m => el("li", {}, m)))));
    const scoreEl = el("p", { class: "xscore" });
    const reasons = el("div", { class: "reasons" }, el("div", { class: "reslabel" }, "Why did you lose marks? Tap any that apply"),
      el("div", { class: "chips" }, Object.entries(REASONS).map(([k, v]) => {
        const b = el("button", { type: "button", class: "rchip", "aria-pressed": "false", "data-r": k }, v);
        b.onclick = () => b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
        return b;
      })));
    const fixBox = el("div", { class: "fixes", hidden: true });
    const showFixes = () => {
      const missed = boxes.filter(b => !b[0].checked).map((b, i) => q.guide[boxes.indexOf(b)]);
      const done = autoScore === q.marks;
      fixBox.hidden = done || !missed.length; fixBox.innerHTML = "";
      if (fixBox.hidden) return;
      const f = FIX[q.subj] || (x => `Missing: ${x}.`);
      fixBox.append(el("b", {}, "What your answer still needs"), el("ul", {}, missed.map(m => el("li", {}, f(m, q)))));
      const t = QTYPES[q.type]; if (t) fixBox.append(el("p", { class: "small" }, el("b", {}, `${t[0]}: `), t[1]));
    };
    const score = () => { const ticked = boxes.filter(b => b[0].checked).length; return q.num ? (autoScore === q.marks ? q.marks : Math.min(q.marks - 1, ticked)) : Math.min(q.marks, ticked); };
    const upd = () => { const s = score(); scoreEl.textContent = `Your mark: ${s} / ${q.marks}`; reasons.hidden = s >= q.marks; showFixes(); };
    boxes.forEach(b => b[0].addEventListener("change", upd)); upd();
    const saveBtn = el("button", { type: "button", class: "btn", onclick: () => {
      const s = score(), rs = [...reasons.querySelectorAll('[aria-pressed="true"]')].map(b => b.dataset.r);
      (st.attempts[q.id] = st.attempts[q.id] || []).push({ d: todayISO(), score: s, max: q.marks, reasons: rs });
      recordPerf(q.subj, q.topic, s / q.marks);
      if (s < q.marks) {
        st.retry[q.id] = addDays(prevRetries(q.id) ? 4 : 2);
        st.log = st.log.filter(r => r.d || r.s || r.w);
        st.log.unshift({ d: todayShort(), s: q.subj, w: `${q.cmd} (${q.marks}): ${q.q.slice(0, 90)}${q.q.length > 90 ? "…" : ""} Scored ${s}/${q.marks}.`, r: rs[0] || "", f: false, qid: q.id });
      } else delete st.retry[q.id];
      delete st.drafts[q.id];
      save(); renderTracker(); renderLog(); renderProgress();
      saveBtn.disabled = true;
      const et = rs.length ? errorTypeOf(rs[0]) : null;
      panel.append(el("p", { class: "saved", role: "status" }, s >= q.marks ? (prevLast && prevLast.score < q.marks ? "Saved. Full marks this time, up from last time." : "Saved. Full marks.") : `Saved. This question will come back for a retry on ${fmtDate(st.retry[q.id])}. It's in your mistake log too.`),
        et ? el("p", { class: "small" }, el("b", {}, `${ERROR_TYPES[et].name}: `), ERROR_ADVICE[et]) : null,
        el("button", { type: "button", class: "btn ghost", onclick: () => { const n = examQBlock(q); wrap.replaceWith(n); n.scrollIntoView({ behavior: "smooth", block: "start" }); } }, "Try it again now"));
    } }, "Save this attempt");
    panel.append(scoreEl, fixBox, reasons, saveBtn);
  }
  return wrap;
}
const prevRetries = id => (st.attempts[id] || []).filter(a => a.score < a.max).length > 1;

/* ---------- ENGLISH WORKOUT (guided ladder) ---------- */
function skillChecklist(id, onSave) {
  const box = el("div", { class: "skillcheck" }, el("div", { class: "reslabel" }, "Check your own answer honestly. Did you…"));
  const cbs = SKILLS.map(([k, label]) => { const cb = el("input", { type: "checkbox", id: `sk-${id}-${k}`, "data-k": k }); box.append(el("label", { class: "gitem", for: `sk-${id}-${k}` }, cb, el("span", {}, label))); return cb; });
  const btn = el("button", { type: "button", class: "btn", onclick: () => {
    const checks = {}; cbs.forEach(c => checks[c.dataset.k] = c.checked);
    st.skills.push({ d: todayISO(), id, checks });
    const n = Object.values(checks).filter(Boolean).length;
    recordPerf("eng", "Explaining what a quote suggests and implies", n / SKILLS.length);
    if (!checks.imply || !checks.assoc) { st.log = st.log.filter(r => r.d || r.s || r.w); st.log.unshift({ d: todayShort(), s: "eng", w: `Analysis practice (${id}): ${!checks.imply ? "didn't develop an implication" : "didn't explore associations"}.`, r: "analysis", f: false }); }
    save(); renderTracker(); renderLog(); renderProgress();
    btn.disabled = true; box.append(el("p", { class: "saved", role: "status" }, n === SKILLS.length ? "Saved. That's a fully developed analysis." : `Saved: ${n} of ${SKILLS.length}. Next time, aim to tick the ones you missed.`));
    if (onSave) onSave();
  } }, "Save my check");
  box.append(btn);
  return box;
}

function workoutBlock(w) {
  const box = el("article", { class: "workout", id: `wo-${w.id}` },
    el("div", { class: "wohead" }, el("span", { class: "small" }, w.text), el("blockquote", {}, `“${w.quote}”`)));
  w.steps.forEach(([prompt, model], i) => {
    const ta = el("textarea", { id: `wo-${w.id}-${i}`, rows: 2, "aria-label": prompt, placeholder: i === 1 ? "List as many as you can" : "Your thinking" }, (st.drafts[`wo-${w.id}-${i}`] || ""));
    ta.addEventListener("input", () => { st.drafts[`wo-${w.id}-${i}`] = ta.value; save(); });
    const mdl = el("p", { class: "womodel", hidden: true }, el("b", {}, "One possible answer: "), model);
    const btn = el("button", { type: "button", class: "linkbtn", onclick: () => { if (!ta.value.trim()) { toast("Write your own idea first, then compare."); ta.focus(); return; } mdl.hidden = false; btn.hidden = true; } }, "Compare");
    box.append(el("div", { class: "wostep" }, el("label", { for: `wo-${w.id}-${i}` }, el("b", {}, `${i + 1}. `), prompt), ta, btn, mdl));
  });
  box.append(el("p", { class: "small" }, "Now turn your notes into one paragraph in your book, then check it:"), skillChecklist(w.id));
  return box;
}

function improveBlock(p) {
  const ta = el("textarea", { id: `imp-${p.id}`, rows: 5, "aria-label": "Your improved paragraph", placeholder: "Rewrite the paragraph so it explores what the image suggests and implies." }, (st.drafts[p.id] || ""));
  ta.addEventListener("input", () => { st.drafts[p.id] = ta.value; save(); });
  const reveal = el("div", { hidden: true },
    el("p", { class: "womodel" }, el("b", {}, "What was weak: "), p.problem),
    el("p", { class: "womodel" }, el("b", {}, "A developed version: "), p.model),
    el("p", { class: "small" }, "Yours doesn't need to match. Ask: did I explore the image and develop what it implies?"),
    skillChecklist(p.id));
  const btn = el("button", { type: "button", class: "btn", onclick: () => { if (!ta.value.trim()) { toast("Have a go at rewriting it first."); ta.focus(); return; } reveal.hidden = false; btn.hidden = true; } }, "Compare with a developed version");
  return el("article", { class: "workout", id: `imp-${p.id}-box` }, el("div", { class: "reslabel" }, "Weak paragraph"), el("blockquote", { class: "weak" }, p.weak), ta, btn, reveal);
}

function ladderExample(ex) {
  return el("article", { class: "ladder" }, el("p", { class: "xqq" }, ex.q),
    ex.levels.map(([lvl, ans, why], i) => el("div", { class: `rung r${i}` }, el("span", { class: "rlvl" }, lvl), el("p", {}, ans), el("p", { class: "small" }, why))));
}

function workedExample(q) {
  return el("article", { class: "ladder", style: `--c:${col(q.subj)}` }, el("p", { class: "xqq" }, `${q.q} [${q.marks}]`),
    el("div", { class: "rung r0" }, el("span", { class: "rlvl" }, "Basic answer"), el("p", {}, q.basic)),
    el("div", { class: "rung r1" }, el("span", { class: "rlvl" }, "Feedback"), el("p", {}, q.feedback)),
    el("div", { class: "rung r2" }, el("span", { class: "rlvl" }, "Improved answer"), el("p", {}, q.model)));
}

/* ---------- PRACTISE TAB ---------- */
function renderPractise() {
  const s = $("#sessions"); if (!s) return; s.innerHTML = "";
  const step = (txt, label, go) => el("li", {}, el("span", {}, txt), go ? el("button", { type: "button", class: "linkbtn", onclick: go }, label) : null);
  s.append(
    el("div", { class: "sess", style: "--c:var(--eng)" }, el("b", {}, "15 minutes"), el("strong", {}, "English analysis"), el("ol", {},
      step("5 min: read a worked example", "Open", () => openModule("eng", "eng-examples")),
      step("7 min: improve a weak paragraph", "Open", () => openModule("eng", "eng-improve")),
      step("3 min: compare and tick the checklist"))),
    el("div", { class: "sess", style: "--c:var(--bio)" }, el("b", {}, "25 minutes"), el("strong", {}, "Science"), el("ol", {},
      step("5 min: active recall with flashcards", "Open", () => { deck = "all"; renderFlash(); location.hash = "cards"; }),
      step("15 min: exam questions", "Choose", () => document.getElementById("modules").scrollIntoView({ behavior: "smooth" })),
      step("5 min: review your mistakes", "Open", () => { location.hash = "tracker"; }))),
    el("div", { class: "sess", style: "--c:var(--accent)" }, el("b", {}, "50 minutes"), el("strong", {}, "A full plan block"), el("ol", {},
      step("Recall, check, practise, mark", "Open plan", () => { location.hash = "plan"; }))));
  const g = $("#modules"); g.innerHTML = "";
  MODULES.forEach(m => {
    const qs = EXAMQ.filter(q => q.mod === m.id);
    const due = qs.filter(q => st.retry[q.id] && st.retry[q.id] <= todayISO()).length;
    g.append(el("button", { type: "button", class: "qcard", style: `--c:${col(m.subj)}`, onclick: () => openModule(m.id) },
      m.focus ? el("em", { class: "fbadge" }, "Teacher focus") : null,
      el("strong", {}, m.title), el("span", {}, m.sub),
      due ? el("span", { class: "best" }, `${due} ready to retry`) : null));
  });
}

function openModule(id, anchor) {
  if (location.hash !== "#quiz") location.hash = "quiz";
  const m = MODULES.find(x => x.id === id); if (!m) return;
  const box = $("#module"); box.innerHTML = ""; box.hidden = false; $("#practise-home").hidden = true;
  box.style.setProperty("--c", col(m.subj));
  box.append(el("button", { type: "button", class: "linkbtn back", onclick: closeModule }, "← All practice"),
    el("div", { class: "label", style: `color:${col(m.subj)}` }, m.focus ? "Teacher focus" : "Exam coach"), el("h2", {}, m.title));
  const sec = (title, idAttr, ...kids) => el("section", { class: "msec", id: idAttr || null }, el("h3", {}, title), ...kids);

  if (id === "eng") {
    box.append(
      sec("Three questions to ask of every quote", null,
        el("ol", { class: "steps3" },
          el("li", {}, el("b", {}, "What does it say? "), "The literal or obvious meaning."),
          el("li", {}, el("b", {}, "What does it suggest? "), "Explore the image, metaphor and the associations of key words."),
          el("li", {}, el("b", {}, "What else could it imply? "), "A deeper or alternative meaning, or what it shows about character, theme or the writer's purpose.")),
        el("p", { class: "small" }, "This is a way of thinking, not a formula to copy. Writing “this suggests” only helps if you then actually explain a new meaning. Every interpretation must come from the words and the text, not be invented."),
        el("p", { class: "small" }, el("b", {}, "AO2 in plain English: "), "the examiner rewards how well you explain the writer's choices of language, form and structure and the effects they create. No single structure guarantees a grade; developed, supported thinking is what scores.")),
      sec("How answers improve", "eng-examples", ...ENGLISH_EXAMPLES.map(ladderExample)),
      sec("Spot the key word", null, el("p", { class: "small" }, "Strong analysis zooms in on the word that carries the meaning."), ...KEYWORD_CHECKS.map(k => mcqBlock({ ...k, t: "Explaining what a quote suggests and implies" }, "eng"))),
      sec("Analysis workouts", "eng-workouts", el("p", { class: "small" }, "Work through each step yourself before comparing. Aim for your own ideas: the model is one possible answer, not the only one."), ...WORKOUTS.map(workoutBlock)),
      sec("Improve a weak paragraph", "eng-improve", ...IMPROVE.map(improveBlock)),
      sec("Exam-style practice", null, ...EXAMQ.filter(q => q.mod === "eng").map(examQBlock)));
  } else if (id === "cmd") {
    box.append(el("p", { class: "small" }, "Command words tell you what kind of answer earns marks. Their exact meaning can vary between subjects and exam boards, so check your teacher's guidance too."));
    COMMANDS.forEach(c => box.append(el("article", { class: "cmdcard" },
      el("h3", {}, c.w), el("p", {}, el("b", {}, "Means: "), c.means), el("p", {}, el("b", {}, "Examiner expects: "), c.expects),
      el("div", { class: "rung r2" }, el("span", { class: "rlvl" }, "Example"), el("p", {}, c.eg[0]), el("p", { class: "small" }, c.eg[1])),
      el("p", { class: "small" }, el("b", {}, "Common mistake: "), c.mistake), mcqBlock(c.check))));
  } else if (id === "marks") {
    box.append(el("p", { class: "small" }, "Marks are a guide to depth, not a strict count of points. Longer answers are often marked on overall quality."),
      el("div", { class: "marktable" }, MARKS.map(([m, t]) => el("div", { class: "mrow" }, el("b", {}, m), el("span", {}, t)))),
      sec("Every time", null, el("ul", { class: "rules" }, MARK_RULES.map(r => el("li", {}, r)))),
      sec("Check yourself", null, ...MARK_CHECKS.map(c => mcqBlock(c))),
      sec("Worked example", null, workedExample(EXAMQ.find(q => q.id === "nacl-mp"))));
  } else {
    const t = MODULE_TEXT[id] || {};
    const qs = EXAMQ.filter(q => q.mod === id);
    box.append(sec("The key idea", null, el("p", {}, t.explain || "")));
    const worked = qs.filter(q => q.basic);
    if (worked.length) box.append(sec("Worked example", null, ...worked.map(workedExample)));
    if (t.checks && t.checks.length) box.append(sec("Quick knowledge check", null, ...t.checks.map(c => mcqBlock(c, m.subj))));
    if (t.graphNote) box.append(el("p", { class: "small" }, t.graphNote));
    box.append(sec("Exam-style questions", "xq-list", el("p", { class: "small" }, "Answer first, then mark yourself against the guidance. Anything you don't get full marks on comes back for a retry."), ...qs.map(examQBlock)));
  }
  const target = anchor ? document.getElementById(anchor) : box;
  setTimeout(() => (target || box).scrollIntoView({ behavior: "smooth", block: "start" }), 30);
}
function closeModule() { $("#module").hidden = true; $("#practise-home").hidden = false; renderPractise(); window.scrollTo({ top: 0, behavior: "smooth" }); }
function openQuestion(qid) { const q = EXAMQ.find(x => x.id === qid); if (q) openModule(q.mod, `xq-${qid}`); }

/* ---------- MY PROGRESS: learning, retries, recommendations ---------- */
function reasonCounts() {
  const c = {};
  st.log.forEach(r => { if (r.r && !r.f) c[r.r] = (c[r.r] || 0) + 1; });
  // a failed attempt already logs its first reason as a mistake, so only count any extra reasons here
  Object.values(st.attempts).flat().forEach(a => (a.reasons || []).slice(1).forEach(r => { c[r] = (c[r] || 0) + 1; }));
  return c;
}
const errorTypeOf = r => Object.keys(ERROR_TYPES).find(k => ERROR_TYPES[k].reasons.includes(r)) || null;
function errorTypeCounts() {
  const rc = reasonCounts();
  return Object.entries(ERROR_TYPES).map(([k, t]) => ({ k, name: t.name, desc: t.desc, n: t.reasons.reduce((a, r) => a + (rc[r] || 0), 0) }));
}
/* How much of each practice area she has tried */
function coverage() {
  return MODULES.filter(m => EXAMQ.some(q => q.mod === m.id)).map(m => {
    const qs = EXAMQ.filter(q => q.mod === m.id);
    const tried = qs.filter(q => (st.attempts[q.id] || []).length);
    const last = tried.map(q => st.attempts[q.id].slice(-1)[0].d).sort().pop() || null;
    return { id: m.id, subj: m.subj, title: m.title, focus: !!m.focus, total: qs.length, done: tried.length, last,
      full: tried.filter(q => { const a = st.attempts[q.id].slice(-1)[0]; return a.score >= a.max; }).length };
  });
}
const daysSince = iso => { if (!iso) return null; const [y, m, d] = iso.split("-").map(Number); return Math.round((new Date(new Date().toDateString()) - new Date(y, m - 1, d)) / 864e5); };
/* Suggestions, each with a reason. kind: "school" = from teacher feedback, "suggested" = from her own practice. */
function recommendations() {
  const recs = [];
  const add = (kind, subj, title, why, go, pri) => recs.push({ kind, subj, title, why, go, pri });
  const due = Object.entries(st.retry).filter(([, d]) => d <= todayISO());
  if (due.length) { const q = EXAMQ.find(x => x.id === due[0][0]); add("suggested", q ? q.subj : "", `${due.length} question${due.length > 1 ? "s" : ""} ready to retry`, "You didn't get full marks first time. Having another go a few days later is how it sticks.", () => openQuestion(due[0][0]), 100); }
  // patterns in why marks were lost (needs at least 2 examples)
  const go = { knowledge: () => { location.hash = "cards"; }, understanding: () => openModule("bio", "xq-list"), application: () => openModule("maths", "xq-list"), analysis: () => openModule("eng", "eng-workouts"), technique: () => openModule("cmd") };
  errorTypeCounts().filter(e => e.n >= 2).sort((a, b) => b.n - a.n).slice(0, 2).forEach(e =>
    add("suggested", "", `Pattern: ${e.name.toLowerCase()}`, `${e.n} times you said you lost marks because you ${e.desc}. ${ERROR_ADVICE[e.k]}`, go[e.k], 80 + e.n));
  // low performance topics (at least 3 answers)
  Object.keys(st.perf).forEach(k => {
    const p = perfStats(k); if (p.recent < 3 || p.avg >= 0.5) return;
    const [sj, t] = k.split("|"); const q = EXAMQ.find(x => x.subj === sj && x.topic === t);
    add("suggested", sj, `More practice: ${t}`, `Your last ${p.recent} answers on this averaged ${Math.round(p.avg * 100)}%.`, q ? () => openQuestion(q.id) : () => { location.hash = "quiz"; }, 70);
  });
  const sk = st.skills.slice(-4);
  if (sk.length >= 2 && sk.filter(x => !x.checks.imply).length >= 2) add("school", "eng", "English: develop the implication", "Your teacher asked for this, and your recent self-checks often stopped before it.", () => openModule("eng", "eng-workouts"), 75);
  // coverage: teacher focus not started, other areas not started, areas not revisited
  coverage().forEach(c => {
    const ds = daysSince(c.last);
    if (!c.done && c.focus) add("school", c.subj, `Start: ${c.title}`, "Your teachers flagged this. You haven't tried these questions yet.", () => openModule(c.id), 60);
    else if (!c.done) add("suggested", c.subj, `Not tried yet: ${c.title}`, `${c.total} questions you haven't attempted. Worth a look so nothing is left untested.`, () => openModule(c.id), 40);
    else if (ds != null && ds >= 4) add("suggested", c.subj, `Revisit: ${c.title}`, `Last practised ${ds} days ago. A quick revisit stops it fading.`, () => openModule(c.id), 35);
  });
  // keep strong areas ticking over
  Object.keys(st.perf).forEach(k => { const p = perfStats(k); if (p.recent >= 3 && p.avg >= 0.85) { const [sj, t] = k.split("|"); add("suggested", sj, `Keep it up: ${t}`, `Averaging ${Math.round(p.avg * 100)}%. One short go now and then keeps it secure.`, () => { location.hash = "cards"; }, 10); } });
  // balance: no more than 2 per subject, and at most 5 in total
  // and no more than 2 "start something new" items, so new areas don't crowd out what she's working on
  const per = {}, out = []; let starts = 0;
  recs.sort((a, b) => b.pri - a.pri).forEach(r => {
    const k = r.subj || "_"; const isStart = /^(Start|Not tried yet):/.test(r.title);
    if ((per[k] || 0) >= 2 || out.length >= 5 || (isStart && starts >= 2)) return;
    per[k] = (per[k] || 0) + 1; if (isStart) starts++; out.push(r);
  });
  return out;
}

function renderProgress() {
  const recBox = $("#recs"); if (!recBox) return; recBox.innerHTML = "";
  const recs = recommendations();
  if (!recs.length) recBox.append(el("p", { class: "small" }, "Answer a few practice questions and your next best steps will appear here."));
  recs.forEach(r => recBox.append(el("button", { type: "button", class: "rec", style: r.subj && SUBJECTS[r.subj] ? `--c:${col(r.subj)}` : "", onclick: r.go },
    el("em", { class: `rkind ${r.kind}` }, r.kind === "school" ? "School focus" : "Suggested from your practice"), el("strong", {}, r.title), el("span", {}, r.why))));
  if (recs.length) recBox.append(el("p", { class: "small", style: "grid-column:1/-1" }, "These are suggestions. You choose what to do."));

  const all = Object.entries(st.attempts);
  const flat = all.map(([, a]) => a).flat();
  const got = flat.reduce((n, a) => n + a.score, 0), max = flat.reduce((n, a) => n + a.max, 0);
  const retried = all.filter(([, a]) => a.length > 1);
  const improved = retried.filter(([, a]) => a[a.length - 1].score > a[0].score).length;
  const fixed = st.log.filter(r => r.f && (r.w || "").trim()).length;
  const tile = (n, label, sub) => el("div", { class: "tile" }, el("b", {}, n), el("span", {}, label), sub ? el("small", {}, sub) : null);
  $("#learning").replaceChildren(
    tile(String(flat.length), "exam questions attempted"),
    tile(max ? `${got} / ${max}` : "–", "marks achieved", max ? `${Math.round(got / max * 100)}% of available marks` : "Self-marked"),
    tile(String(improved), "improved on a retry", retried.length ? `out of ${retried.length} retried` : null),
    tile(String(fixed), "mistakes marked fixed"),
    ...(Object.keys(st.ai).length ? [tile(String(Object.values(st.ai).reduce((n, a) => n + a.length, 0)), "answers given AI feedback", "AI estimates: not counted in your marks")] : []));

  // English skills
  const sk = st.skills;
  const skBox = $("#skillprog"); skBox.innerHTML = "";
  if (!sk.length) skBox.append(el("p", { class: "small" }, "Do an analysis workout or improve a paragraph in Practise → Analysing quotations. Your skills will be tracked here."));
  else {
    const half = Math.max(1, Math.floor(sk.length / 2));
    const early = sk.length >= 4 ? sk.slice(0, half) : null, recent = sk.slice(-Math.min(sk.length, 5));
    const rate = (list, k) => list.filter(x => x.checks[k]).length / list.length;
    skBox.append(el("p", { class: "small" }, `Based on ${sk.length} self-checked piece${sk.length > 1 ? "s" : ""} of analysis${early ? ". Shows your first attempts against your latest." : "."}`));
    SKILLS.forEach(([k, label]) => {
      const r = rate(recent, k), e = early ? rate(early, k) : null;
      skBox.append(el("div", { class: "skrow" }, el("span", {}, label),
        el("div", { class: "skbar" }, el("i", { style: `width:${Math.round(r * 100)}%` })),
        el("small", {}, `${Math.round(r * 100)}%${e != null ? ` (was ${Math.round(e * 100)}%)` : ""}`)));
    });
  }
  renderSkills5(); renderCoverage(); renderErrorTypes(); renderTrialSummary();
  // retries
  const rBox = $("#retries"); rBox.innerHTML = "";
  const list = Object.entries(st.retry).sort((a, b) => a[1] < b[1] ? -1 : 1);
  if (!list.length) rBox.append(el("p", { class: "small" }, "Nothing to retry. Questions you don't get full marks on will appear here."));
  list.forEach(([id, d]) => { const q = EXAMQ.find(x => x.id === id); if (!q) return; const a = st.attempts[id] || [];
    rBox.append(el("div", { class: "retryrow", style: `--c:${col(q.subj)}` }, el("div", {}, el("b", {}, `${SUBJECTS[q.subj].name} · ${q.cmd} (${q.marks})`), el("span", {}, q.q)),
      el("div", { class: "row-actions" }, el("small", {}, a.length ? `Last: ${a[a.length - 1].score}/${q.marks}` : ""),
        el("button", { type: "button", class: d <= todayISO() ? "btn" : "btn ghost", onclick: () => openQuestion(id) }, d <= todayISO() ? "Retry now" : `From ${fmtDate(d)}`)))); });
  // activity
  const blocks = document.querySelectorAll(".tick:checked").length;
  $("#activity").textContent = `${blocks} revision blocks ticked · ${Object.values(st.studyLog || {}).reduce((a, b) => a + b, 0)} flashcard reviews · ${Object.values(st.best).length} subject quizzes tried`;
}

function renderCoverage() {
  const box = $("#coverage"); if (!box) return; box.innerHTML = "";
  coverage().forEach(c => box.append(el("div", { class: "covrow", style: `--c:${col(c.subj)}` },
    el("span", {}, c.title, c.focus ? el("em", { class: "fbadge" }, "Teacher focus") : null),
    el("div", { class: "skbar" }, el("i", { style: `width:${Math.round(c.done / c.total * 100)}%` })),
    el("small", {}, `${c.done}/${c.total} tried${c.full ? ` · ${c.full} full marks` : ""}`))));
}
function renderErrorTypes() {
  const box = $("#errtypes"); if (!box) return; box.innerHTML = "";
  const list = errorTypeCounts(), total = list.reduce((a, e) => a + e.n, 0);
  if (total < 2) { box.append(el("p", { class: "small" }, "When you lose marks, pick why. Once there are a few examples, patterns will show here. One wrong answer on its own doesn't tell us much.")); return; }
  list.forEach(e => box.append(el("div", { class: "skrow" }, el("span", {}, el("b", {}, e.name), el("small", { class: "block" }, e.desc)),
    el("div", { class: "skbar" }, el("i", { style: `width:${Math.round(e.n / total * 100)}%` })), el("small", {}, String(e.n)))));
  const top = list.slice().sort((a, b) => b.n - a.n)[0];
  if (top.n >= 2) box.append(el("p", { class: "small" }, el("b", {}, "Try this: "), ERROR_ADVICE[top.k]));
  box.append(el("p", { class: "small" }, "Based on your own choices when marking, not a teacher's assessment."));
}
/* The five exam skills, from what she has actually done */
function skills5() {
  const qc = Object.values(st.qcheck).flat();
  const latest = EXAMQ.filter(q => (st.attempts[q.id] || []).length).map(q => ({ q, a: st.attempts[q.id].slice(-1)[0] }));
  const frac = k => { const l = latest.filter(x => x.q.sk.includes(k)); return l.length ? { v: l.reduce((n, x) => n + x.a.score / x.a.max, 0) / l.length, n: l.length } : { v: null, n: 0 }; };
  const failed = Object.values(st.attempts).flat().filter(a => a.score < a.max);
  return {
    understand: qc.length ? { v: qc.filter(x => x.ok).length / qc.length, n: qc.length, how: "question types identified correctly" } : { v: null, n: 0, how: "Use “what is this question asking for?” before you answer" },
    explain: { ...frac("explain"), how: "marks on explain and analyse questions" },
    evidence: { ...frac("evidence"), how: "marks on questions using a graph, table, source or quote" },
    conclude: { ...frac("conclude"), how: "marks on compare and judge questions" },
    review: failed.length ? { v: failed.filter(a => (a.reasons || []).length).length / failed.length, n: failed.length, how: "dropped marks where you picked a reason" } : { v: null, n: 0, how: "When you lose marks, pick why" }
  };
}
function renderSkills5() {
  const box = $("#skills5"); if (!box) return; box.innerHTML = "";
  const s = skills5();
  Object.entries(SKILL5).forEach(([k, label]) => { const x = s[k];
    box.append(el("div", { class: "skrow" }, el("span", {}, el("b", {}, label), el("small", { class: "block" }, x.v == null ? (x.how.startsWith("Use") || x.how.startsWith("When") ? x.how : "Not practised yet") : `${x.how} (${x.n})`)),
      el("div", { class: "skbar" }, el("i", { style: `width:${x.v == null ? 0 : Math.round(x.v * 100)}%` })), el("small", {}, x.v == null ? "–" : `${Math.round(x.v * 100)}%`))); });
}
/* A short summary she or a parent can read at the end */
function trialSummaryText() {
  const flat = Object.values(st.attempts).flat();
  const got = flat.reduce((n, a) => n + a.score, 0), max = flat.reduce((n, a) => n + a.max, 0);
  const retried = Object.values(st.attempts).filter(a => a.length > 1);
  const improved = retried.filter(a => a[a.length - 1].score > a[0].score).length;
  const cov = coverage(); const tried = cov.reduce((a, c) => a + c.done, 0), totalQ = cov.reduce((a, c) => a + c.total, 0);
  const topics = Object.keys(st.perf).map(k => ({ k: k.split("|"), p: perfStats(k) })).filter(x => x.p.recent >= 3);
  const name = ([sj, t]) => `${SUBJECTS[sj] ? SUBJECTS[sj].name : sj}: ${t}`;
  const strong = topics.filter(x => x.p.avg >= 0.75).sort((a, b) => b.p.avg - a.p.avg).slice(0, 4).map(x => name(x.k));
  const weak = topics.filter(x => x.p.avg < 0.5).sort((a, b) => a.p.avg - b.p.avg).slice(0, 4).map(x => name(x.k));
  const et = errorTypeCounts().filter(e => e.n >= 2).sort((a, b) => b.n - a.n);
  const blocks = document.querySelectorAll(".tick:checked").length;
  const L = [];
  L.push(`Revision blocks ticked off: ${blocks}`);
  L.push(`Practice questions tried: ${tried} of ${totalQ}${max ? `, scoring ${got} of ${max} marks (${Math.round(got / max * 100)}%)` : ""}`);
  if (retried.length) L.push(`Retried: ${retried.length}. Improved on a retry: ${improved}`);
  L.push(`Flashcards: ${st.cards.length} cards, ${Object.values(st.studyLog || {}).reduce((a, b) => a + b, 0)} reviews`);
  L.push(`Not tried yet: ${cov.filter(c => !c.done).map(c => c.title).join(", ") || "none"}`);
  L.push(`Strongest topics (at least 3 answers): ${strong.join("; ") || "not enough answers yet"}`);
  L.push(`Topics to keep working on: ${weak.join("; ") || "none flagged yet"}`);
  L.push(`Most common reason for lost marks: ${et.length ? `${et[0].name} (${et[0].n})` : "not enough examples yet"}`);
  if (st.skills.length) { const r = st.skills.slice(-5); L.push(`English analysis: developed an implication in ${r.filter(x => x.checks.imply).length} of the last ${r.length} self-checked pieces`); }
  return L;
}
function renderTrialSummary() {
  const box = $("#trialsum"); if (!box) return; box.innerHTML = "";
  const lines = trialSummaryText();
  box.append(el("ul", { class: "sumlist" }, lines.map(l => el("li", {}, l))),
    el("p", { class: "small" }, "From self-marked practice. It shows effort and progress, not a predicted grade."),
    el("div", { class: "row-actions" }, el("button", { type: "button", class: "btn ghost", id: "copy-summary", onclick: () => {
      const txt = "Harriet's revision summary\n" + lines.map(l => "• " + l).join("\n");
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast("Summary copied."), () => toast("Couldn't copy. Select the text instead."));
    } }, "Copy summary")));
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
  renderQuizGrid(); renderFilter(); renderTracker(); renderQuestions(); renderLog(); renderFlash(); renderFocus(); renderPractise(); renderProgress();
}

renderAll(); renderLinks(); wireBackup(); wireFlash(); route(); checkAi();
window.addEventListener("hashchange", route);
document.querySelector('[data-tab="quiz"]').addEventListener("click", () => { if (!$("#module").hidden) closeModule(); });
})();
