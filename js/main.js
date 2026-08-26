/* A/B Audio Toggle - panel logic */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };

  function evalES(script) {
    return new Promise(function (resolve) {
      window.__adobe_cep__.evalScript(script, resolve);
    });
  }

  /* ---------- state ----------
     Checked-track selection persists per sequence id so switching
     sequences (or restarting Premiere) keeps each A/B setup. */

  var STORE_KEY = "abt_state_v1";
  var store = {};          // { [seqId]: [trackIndex, ...] }
  var current = null;      // last snapshot from ABT_getTracks

  function load() {
    try { store = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { store = {}; }
  }
  function save() {
    if (!current || current.err) return;
    store[current.seqId] = checkedIndices();
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }
  function checkedIndices() {
    var out = [];
    $("trackList").querySelectorAll("input[type=checkbox]").forEach(function (cb) {
      if (cb.checked) out.push(parseInt(cb.value, 10));
    });
    return out;
  }

  /* ---------- rendering ---------- */

  function msg(text) { $("msg").textContent = text || ""; }

  function render(snapshot) {
    current = snapshot;
    var box = $("trackList");
    box.innerHTML = "";
    if (!snapshot || snapshot.err) {
      $("seqName").innerHTML = "&nbsp;";
      box.innerHTML = '<div class="muted-hint">' + (snapshot && snapshot.err ? snapshot.err : "No data") + "</div>";
      $("toggleBtn").disabled = true;
      return;
    }
    $("seqName").textContent = snapshot.seqName;
    var saved = store[snapshot.seqId] || [];
    snapshot.tracks.forEach(function (t) {
      var lab = document.createElement("label");
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.value = t.index;
      cb.checked = saved.indexOf(t.index) !== -1;
      cb.addEventListener("change", save);
      var name = document.createElement("span");
      name.textContent = t.name;
      if (t.muted) name.className = "muted-name";
      var state = document.createElement("span");
      state.className = t.muted ? "state muted" : "state";
      state.textContent = t.muted ? "MUTED" : "LIVE";
      lab.appendChild(cb);
      lab.appendChild(name);
      lab.appendChild(state);
      box.appendChild(lab);
    });
    $("toggleBtn").disabled = !snapshot.tracks.length;
  }

  function parse(res) {
    try { return JSON.parse(res); }
    catch (e) { return { err: "Bad response: " + res }; }
  }

  /* ---------- actions ---------- */

  function refresh() {
    msg("");
    return evalES("ABT_getTracks()").then(function (res) { render(parse(res)); });
  }

  function toggle() {
    var idx = checkedIndices();
    if (!idx.length) { msg("No tracks checked."); return; }
    save();
    evalES("ABT_toggle('" + idx.join(",") + "')").then(function (res) {
      var snap = parse(res);
      if (snap.err) { msg(snap.err); return; }
      /* If the active sequence changed since the list was drawn, the
         indices may have hit the wrong tracks - warn and re-render. */
      if (current && snap.seqId !== current.seqId) msg("Sequence changed - list refreshed, check states.");
      render(snap);
    });
  }

  function unmuteAll() {
    evalES("ABT_unmuteAll()").then(function (res) { render(parse(res)); msg(""); });
  }

  /* ---------- wiring ---------- */

  load();
  $("refreshBtn").addEventListener("click", refresh);
  $("unmuteBtn").addEventListener("click", unmuteAll);
  $("toggleBtn").addEventListener("click", toggle);
  refresh().then(function () { $("toggleBtn").focus(); });

  /* Re-sync when the panel regains focus (cheap way to track sequence
     switches and mute changes made in the timeline UI). */
  window.addEventListener("focus", refresh);
})();
