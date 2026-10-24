(() => {
  "use strict";

  const CFG = window.INVITE || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const params = new URLSearchParams(location.search);
  const KEY = "date-invite-v1";

  /* ---------- Petits outils ---------- */
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} }
  };
  if (params.has("reset")) store.clear();

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const pad = n => String(n).padStart(2, "0");
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromIso = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const longDay = s => cap(fromIso(s).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }));
  const emailReady = () => {
    const e = (CFG.notify && CFG.notify.email || "").trim();
    return e && !e.startsWith("ton-email");
  };
  const waNumber = () => (CFG.notify && CFG.notify.whatsapp || "").replace(/\D/g, "");

  /* ---------- État ---------- */
  const urlName = (params.get("pou") || params.get("pour") || "").trim().slice(0, 40);
  const herName = urlName || (CFG.herName || "").trim();
  const displayName = herName || CFG.herFallback || "toi";

  const state = {
    name: herName, day: null, time: null, activity: null, food: null,
    meet: null, dress: null, contact: "", note: "",
    tries: 0, openedAt: null, answeredAt: null
  };

  /* ---------- Textes ---------- */
  $$("[data-her]").forEach(n => (n.textContent = displayName));
  $$("[data-from]").forEach(n => (n.textContent = CFG.fromName || ""));
  $("#introText").textContent = CFG.intro || "";
  $("#questionText").textContent = CFG.question || "Est-ce que tu veux sortir avec moi ?";
  $("#postmark").textContent = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }).replace(".", "").toUpperCase();

  /* ---------- Écrans ---------- */
  function show(id) {
    $$("[data-screen]").forEach(s => (s.hidden = s.id !== id));
    const s = $("#" + id);
    s.classList.remove("enter"); void s.offsetWidth; s.classList.add("enter");
    window.scrollTo(0, 0);
    const h = s.querySelector("h1, h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }

  /* ---------- Cœurs en fond ---------- */
  (function hearts() {
    const c = $("#hearts"); if (!c) return;
    const x = c.getContext("2d");
    let w, h, d, items = [];
    const mk = any => ({
      x: Math.random() * w, y: any ? Math.random() * h : h + 40 * d,
      s: (8 + Math.random() * 18) * d, v: (.15 + Math.random() * .45) * d,
      a: .07 + Math.random() * .13, r: Math.random() * 6.28,
      c: Math.random() < .6 ? "255,79,109" : "140,110,240"
    });
    function size() {
      d = Math.min(devicePixelRatio || 1, 2);
      w = c.width = innerWidth * d; h = c.height = innerHeight * d;
      items = Array.from({ length: Math.max(8, Math.round(innerWidth / 60)) }, () => mk(true));
    }
    function heart(p) {
      x.save(); x.translate(p.x, p.y); x.rotate(Math.sin(p.r) * .3); x.scale(p.s / 20, p.s / 20);
      x.beginPath(); x.moveTo(0, 6);
      x.bezierCurveTo(-12, -4, -6, -14, 0, -7);
      x.bezierCurveTo(6, -14, 12, -4, 0, 6);
      x.fillStyle = `rgba(${p.c},${p.a})`; x.fill(); x.restore();
    }
    function tick() {
      x.clearRect(0, 0, w, h);
      items.forEach((p, i) => {
        heart(p);
        if (!reduce) { p.y -= p.v; p.r += .01; if (p.y < -40 * d) items[i] = mk(false); }
      });
      if (!reduce) requestAnimationFrame(tick);
    }
    size(); tick(); addEventListener("resize", size);
  })();

  /* ---------- Confettis ---------- */
  function burst(big) {
    if (!window.confetti || reduce) return;
    const base = { colors: ["#ff4f6d", "#ffd447", "#1f1838", "#ffffff", "#a98bff"], ticks: 240, scalar: 1.1 };
    confetti({ ...base, particleCount: big ? 140 : 90, spread: 100, origin: { y: .6 } });
    try {
      const shapes = [confetti.shapeFromText({ text: "❤️", scalar: 2 })];
      confetti({ ...base, shapes, scalar: 2, particleCount: 26, spread: 120, origin: { y: .55 } });
    } catch (e) {}
    if (big) {
      setTimeout(() => confetti({ ...base, particleCount: 70, angle: 60, spread: 70, origin: { x: 0, y: .7 } }), 300);
      setTimeout(() => confetti({ ...base, particleCount: 70, angle: 120, spread: 70, origin: { x: 1, y: .7 } }), 550);
    }
  }

  /* ---------- 1. Enveloppe ---------- */
  $("#envelope").addEventListener("click", () => {
    const env = $("#envelope");
    if (env.classList.contains("open")) return;
    env.classList.add("open");
    state.openedAt = new Date().toISOString();
    setTimeout(() => show("s-question"), reduce ? 0 : 1500);
  });

  /* ---------- 2. Oui / Non ---------- */
  const yesBtn = $("#yesBtn"), noBtn = $("#noBtn"), bubble = $("#bubble");
  let noFree = false, noIsYes = false, lastDodge = 0;

  function overlaps(x, y, w, h, r, m) {
    return !(x + w + m < r.left || x - m > r.right || y + h + m < r.top || y - m > r.bottom);
  }
  function moveNo() {
    const b = noBtn.getBoundingClientRect();
    if (!noFree) {
      noBtn.style.width = b.width + "px";
      noBtn.style.left = b.left + "px";
      noBtn.style.top = b.top + "px";
      document.body.appendChild(noBtn);
      noBtn.classList.add("free");
      noFree = true;
      void noBtn.offsetWidth;
    }
    const vw = document.documentElement.clientWidth, vh = window.innerHeight, m = 20;
    const yes = yesBtn.getBoundingClientRect();
    const bub = bubble.getBoundingClientRect();
    let x, y, n = 0;
    do {
      x = m + Math.random() * Math.max(1, vw - b.width - 2 * m);
      y = m + 30 + Math.random() * Math.max(1, vh - b.height - 2 * m - 60);
      n++;
    } while (n < 60 && (overlaps(x, y, b.width, b.height, yes, 24) || overlaps(x, y, b.width, b.height, bub, 10) || Math.hypot(x - b.left, y - b.top) < 110));
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
  }
  function dodge(e) {
    if (e) e.preventDefault();
    if (noIsYes) return sayYes();
    const now = Date.now();
    if (now - lastDodge < 220) return;
    lastDodge = now;
    state.tries++;
    if (state.tries >= (CFG.noLimit || 12)) {
      noIsYes = true;
      noBtn.textContent = "Oui 🙈";
      noBtn.classList.add("converted");
      bubble.textContent = "Bon… même le bouton « Non » a fini par dire oui.";
    } else {
      const msgs = CFG.noMessages || ["Essaie encore 😏"];
      bubble.textContent = msgs[(state.tries - 1) % msgs.length];
      moveNo();
    }
    bubble.classList.remove("pop"); void bubble.offsetWidth; bubble.classList.add("pop");
    yesBtn.style.setProperty("--grow", Math.min(1 + state.tries * .06, 1.55).toFixed(2));
  }
  noBtn.addEventListener("pointerenter", e => { if (e.pointerType === "mouse" && !noIsYes) dodge(); });
  noBtn.addEventListener("pointerdown", e => { if (!noIsYes) dodge(e); });
  noBtn.addEventListener("click", e => { e.preventDefault(); if (noIsYes) sayYes(); else if (e.detail === 0) dodge(); });
  yesBtn.addEventListener("click", sayYes);

  function sayYes() {
    noBtn.remove();
    show("s-yay");
    setTimeout(() => burst(false), 150);
  }
  $("#startPlan").addEventListener("click", () => { show("s-plan"); renderStep(); });

  /* ---------- 3. Choix ---------- */
  function check(wrap, btn) {
    wrap.querySelectorAll("[role=radio]").forEach(b => b.setAttribute("aria-checked", String(b === btn)));
  }
  function buildOptions(sel, list, key, kind) {
    const wrap = $(sel);
    wrap.setAttribute("role", "radiogroup");
    list.forEach(o => {
      const b = el("button", kind === "card" ? "opt-card" : "chip");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", "false");
      if (o.emoji) b.append(el("span", "emo", o.emoji));
      b.append(el("span", "t", o.label));
      if (o.desc && kind === "card") b.append(el("span", "d", o.desc));
      b.addEventListener("click", () => { check(wrap, b); state[key] = o; validate(); });
      wrap.append(b);
    });
  }
  function buildDays() {
    const wrap = $("#days");
    wrap.setAttribute("role", "radiogroup");
    const start = new Date(); start.setHours(0, 0, 0, 0);
    for (let i = 1; i <= (CFG.dayRange || 21); i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const b = el("button", "day");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", "false");
      b.setAttribute("aria-label", longDay(iso(d)));
      if (d.getDay() === 5 || d.getDay() === 6) b.classList.add("weekend");
      b.append(
        el("span", "wd", d.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "")),
        el("span", "num", String(d.getDate())),
        el("span", "mo", d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""))
      );
      b.addEventListener("click", () => { check(wrap, b); $("#otherDate").value = ""; state.day = iso(d); validate(); });
      wrap.append(b);
    }
    const other = $("#otherDate");
    const tomorrow = new Date(start); tomorrow.setDate(start.getDate() + 1);
    other.min = iso(tomorrow);
    other.addEventListener("change", () => {
      if (!other.value) return;
      check(wrap, null);
      state.day = other.value;
      validate();
    });
  }
  buildDays();
  buildOptions("#times", (CFG.times || []).map(t => ({ label: t.replace(":", "h"), value: t })), "time", "chip");
  buildOptions("#activities", CFG.activities || [], "activity", "card");
  buildOptions("#foods", CFG.foods || [], "food", "card");
  buildOptions("#meet", CFG.meet || [], "meet", "chip");
  buildOptions("#dress", CFG.dress || [], "dress", "chip");

  const nameIn = $("#herName");
  nameIn.value = herName;
  nameIn.addEventListener("input", () => { state.name = nameIn.value.trim(); validate(); });
  $("#contact").addEventListener("input", e => (state.contact = e.target.value.trim()));
  $("#note").addEventListener("input", e => (state.note = e.target.value.trim()));

  /* ---------- 4. Navigation ---------- */
  const STEPS = ["when", "what", "food", "details", "recap"];
  const HINTS = {
    when: "Choisis un jour et une heure",
    what: "Choisis une activité",
    food: "Choisis ce qu'on mange",
    details: "Choisis comment on se retrouve, le style, et écris ton prénom"
  };
  let idx = 0, fromRecap = false;

  function valid() {
    switch (STEPS[idx]) {
      case "when": return !!(state.day && state.time);
      case "what": return !!state.activity;
      case "food": return !!state.food;
      case "details": return !!(state.meet && state.dress && state.name);
      default: return true;
    }
  }
  function validate() {
    const ok = valid();
    $("#nextBtn").setAttribute("aria-disabled", String(!ok));
    if (ok) $("#navHint").textContent = "";
  }
  function renderStep() {
    $$(".step").forEach(s => (s.hidden = s.dataset.step !== STEPS[idx]));
    $("#progressBar").style.width = ((idx + 1) / STEPS.length * 100) + "%";
    $("#stepCount").textContent = `Étape ${idx + 1} sur ${STEPS.length}`;
    $("#backBtn").style.visibility = idx === 0 ? "hidden" : "visible";
    const isRecap = STEPS[idx] === "recap";
    $("#nextBtn").textContent = isRecap ? "Confirmer ❤" : (fromRecap ? "Revenir au récap" : "Continuer");
    $("#navHint").textContent = "";
    if (isRecap) buildRecap();
    validate();
    window.scrollTo(0, 0);
    const st = $(`.step[data-step="${STEPS[idx]}"]`);
    st.classList.remove("enter"); void st.offsetWidth; st.classList.add("enter");
  }
  $("#nextBtn").addEventListener("click", () => {
    if (!valid()) {
      const hint = $("#navHint");
      hint.textContent = HINTS[STEPS[idx]] || "";
      hint.classList.remove("shake"); void hint.offsetWidth; hint.classList.add("shake");
      return;
    }
    if (STEPS[idx] === "recap") return confirmDate();
    idx = fromRecap ? STEPS.length - 1 : idx + 1;
    fromRecap = false;
    renderStep();
  });
  $("#backBtn").addEventListener("click", () => {
    if (idx === 0) return;
    idx--; fromRecap = false; renderStep();
  });

  /* ---------- 5. Récap ---------- */
  function rows() {
    const r = [
      ["Le jour", longDay(state.day), 0],
      ["L'heure", state.time.label, 0],
      ["L'activité", `${state.activity.emoji || ""} ${state.activity.label}`.trim(), 1],
      ["Au menu", `${state.food.emoji || ""} ${state.food.label}`.trim(), 2],
      ["Le rendez-vous", `${state.meet.emoji || ""} ${state.meet.label}`.trim(), 3],
      ["Le style", `${state.dress.emoji || ""} ${state.dress.label}`.trim(), 3]
    ];
    if (state.note) r.push(["Ton mot", state.note, 3]);
    return r;
  }
  function buildRecap() {
    const dl = $("#recap");
    dl.replaceChildren();
    rows().forEach(([k, v, step]) => {
      const row = el("div", "row");
      const edit = el("button", "edit", "Modifier");
      edit.type = "button";
      edit.setAttribute("aria-label", `Modifier : ${k}`);
      edit.addEventListener("click", () => { idx = step; fromRecap = true; renderStep(); });
      row.append(el("dt", null, k), el("dd", null, v), edit);
      dl.append(row);
    });
  }

  /* ---------- 6. Envoi ---------- */
  function sendEmail() {
    const triesLine = state.tries === 0
      ? "Li di WI tousuit, li pa menm eseye peze NON 🔥"
      : `Li te eseye peze NON ${state.tries} fwa anvan l rann tèt li 😂`;
    const payload = {
      _subject: `🎉 Frè, ou gen yon date! ${state.name} di WI`,
      _template: "table",
      _captcha: "false",
      "📣 Nouvèl la": `Frè! Nou gen yon date la wi 😎🔥 ${state.name} aksepte envitasyon w lan. ${triesLine}. Prepare w, pa fè nou wont!`,
      "👤 Kiyès": state.name,
      "📅 Ki jou": longDay(state.day),
      "🕒 Ki lè": state.time.label,
      "📍 Sa n ap fè": state.activity.label,
      "🍽️ Sa n ap manje": state.food.label,
      "🚗 Kijan n ap kontre": state.meet.label,
      "👗 Stil la": state.dress.label,
      "💬 Ti mesaj li": state.note || "—",
      "📱 WhatsApp li": state.contact || "—",
      "😂 Kantite fwa li eseye NON": String(state.tries),
      "✉️ Li louvri lèt la": state.openedAt ? new Date(state.openedAt).toLocaleString("fr-FR") : "—",
      "✅ Li reponn": new Date(state.answeredAt).toLocaleString("fr-FR")
    };
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    return fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CFG.notify.email.trim())}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal
    })
      .then(r => r.json())
      .then(j => {
        clearTimeout(timer);
        if (!(j.success === true || j.success === "true")) throw new Error(j.message || "Envoi refusé");
      });
  }

  async function confirmDate() {
    const btn = $("#nextBtn");
    if (btn.classList.contains("loading")) return;
    btn.classList.add("loading");
    btn.textContent = "Envoi en cours…";
    state.answeredAt = new Date().toISOString();
    let status = "demo";
    if (emailReady()) {
      try { await sendEmail(); status = "sent"; }
      catch (e) { console.warn("[invitation]", e); status = "failed"; }
    }
    state.status = status;
    store.set(state);
    btn.classList.remove("loading");
    renderDone(false);
    show("s-done");
    setTimeout(() => burst(true), 250);
  }

  /* ---------- 7. Confirmation ---------- */
  function target() {
    const [y, m, d] = state.day.split("-").map(Number);
    const [hh, mm] = state.time.value.split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm);
  }
  function calendarUrl() {
    const t = target();
    const end = new Date(t.getTime() + (CFG.durationHours || 3) * 3600000);
    const f = x => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const q = new URLSearchParams({
      action: "TEMPLATE",
      text: `Date avec ${CFG.fromName || "lui"} ❤`,
      dates: `${f(t)}/${f(end)}`,
      details: `${state.activity.label} · ${state.food.label} · ${state.meet.label} · Style : ${state.dress.label}`
    });
    if (tz) q.set("ctz", tz);
    return `https://calendar.google.com/calendar/render?${q}`;
  }
  function waUrl() {
    const n = waNumber();
    if (!n) return "";
    const lines = [
      `Coucou ${CFG.fromName || ""} ! C'est ${state.name} 😊`,
      "J'ai dit OUI 💘",
      "",
      `📅 ${longDay(state.day)} à ${state.time.label}`,
      `📍 ${state.activity.label}`,
      `🍽️ ${state.food.label}`,
      `🚗 ${state.meet.label}`,
      `✨ Style : ${state.dress.label}`
    ];
    if (state.note) lines.push("", `💬 ${state.note}`);
    return `https://wa.me/${n}?text=${encodeURIComponent(lines.join("\n"))}`;
  }
  let cdTimer = null;
  function countdown() {
    const box = $("#countdown");
    const diff = target() - new Date();
    box.replaceChildren();
    if (diff <= 0) {
      const sameDay = iso(new Date()) === state.day;
      box.append(el("p", "cd-msg", sameDay ? "C'est aujourd'hui ! ❤" : "J'espère que c'était parfait ❤"));
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff % 86400000 / 3600000);
    const mins = Math.floor(diff % 3600000 / 60000);
    [[days, days > 1 ? "jours" : "jour"], [hours, "heures"], [mins, "min"]].forEach(([v, l]) => {
      const u = el("div", "cd-unit");
      u.append(el("span", "cd-num", pad(v)), el("span", "cd-lbl", l));
      box.append(u);
    });
  }
  function setStatus(status) {
    const s = $("#sendStatus");
    const retry = $("#retryBtn");
    retry.hidden = status !== "failed";
    s.className = "status " + status;
    s.textContent = {
      sent: "✓ Ta réponse m'est bien parvenue.",
      demo: "Mode test : aucun email n'a été envoyé. Renseigne ton adresse dans js/config.js.",
      failed: "Oups, la confirmation n'est pas partie. Réessaie, ou écris-moi directement sur WhatsApp."
    }[status] || "";
  }
  function renderDone(again) {
    $("#doneName").textContent = state.name || displayName;
    $("#admitName").textContent = state.name || displayName;
    if (again) $("#doneLead").textContent = "Tu as déjà dit oui 😌 Voici notre rendez-vous.";
    const info = $("#ticketInfo");
    info.replaceChildren();
    rows().filter(r => r[0] !== "Ton mot").forEach(([k, v]) => {
      const d = el("div", "ti");
      d.append(el("dt", null, k), el("dd", null, v));
      info.append(d);
    });
    $("#ticketNo").textContent = `N° ${state.day.slice(5).replace("-", "")}-${state.time.value.replace(":", "")}`;
    $("#calBtn").href = calendarUrl();
    const wa = waUrl();
    $("#waBtn").hidden = !wa;
    if (wa) $("#waBtn").href = wa;
    $("#waBtn").classList.toggle("btn-primary", state.status === "failed");
    $("#waBtn").classList.toggle("btn-ghost", state.status !== "failed");
    setStatus(state.status);
    countdown();
    clearInterval(cdTimer);
    cdTimer = setInterval(countdown, 30000);
  }
  $("#retryBtn").addEventListener("click", async () => {
    const b = $("#retryBtn");
    b.disabled = true; b.textContent = "Envoi…";
    try { await sendEmail(); state.status = "sent"; }
    catch (e) { state.status = "failed"; }
    store.set(state);
    b.disabled = false; b.textContent = "Renvoyer ma réponse";
    renderDone(false);
  });

  /* ---------- Démarrage ---------- */
  const saved = store.get();
  if (saved && saved.answeredAt && saved.day && saved.time) {
    Object.assign(state, saved);
    renderDone(true);
    show("s-done");
    // Réponse jamais arrivée (mode test ou échec) et email maintenant configuré : on renvoie
    if (state.status !== "sent" && emailReady()) {
      $("#sendStatus").textContent = "Envoi de ta réponse…";
      sendEmail()
        .then(() => { state.status = "sent"; })
        .catch(() => { state.status = "failed"; })
        .then(() => { store.set(state); renderDone(true); });
    }
  } else {
    show("s-envelope");
  }
})();