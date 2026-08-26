/* A/B Audio Toggle - ExtendScript host.
   All functions prefixed ABT_ (the ExtendScript engine is shared with other panels).
   Returns are hand-built JSON strings (ExtendScript has no JSON object). */

function ABT__esc(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/[\r\n]/g, " ");
}

/* JSON snapshot of the active sequence's audio tracks and mute states. */
function ABT_getTracks() {
  var seq = app.project.activeSequence;
  if (!seq) return '{"err":"No active sequence"}';
  var parts = [];
  var n = seq.audioTracks.numTracks;
  for (var i = 0; i < n; i++) {
    var t = seq.audioTracks[i];
    parts.push('{"index":' + i +
      ',"name":"' + ABT__esc(t.name) + '"' +
      ',"muted":' + (t.isMuted() ? "true" : "false") + '}');
  }
  return '{"seqId":"' + ABT__esc(seq.sequenceID) + '"' +
    ',"seqName":"' + ABT__esc(seq.name) + '"' +
    ',"tracks":[' + parts.join(",") + ']}';
}

/* Flip mute state on each track index in the CSV list; returns fresh snapshot. */
function ABT_toggle(csv) {
  var seq = app.project.activeSequence;
  if (!seq) return '{"err":"No active sequence"}';
  var idx = String(csv).split(",");
  for (var i = 0; i < idx.length; i++) {
    var k = parseInt(idx[i], 10);
    if (isNaN(k) || k < 0 || k >= seq.audioTracks.numTracks) continue;
    var t = seq.audioTracks[k];
    t.setMute(t.isMuted() ? 0 : 1);
  }
  return ABT_getTracks();
}

/* Reset to a known state: unmute every audio track. */
function ABT_unmuteAll() {
  var seq = app.project.activeSequence;
  if (!seq) return '{"err":"No active sequence"}';
  for (var i = 0; i < seq.audioTracks.numTracks; i++) {
    seq.audioTracks[i].setMute(0);
  }
  return ABT_getTracks();
}
