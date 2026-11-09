# A/B Audio Toggle — developer notes

CEP panel for Premiere Pro (Windows): check some audio tracks, press one big
button, and every checked track flips its mute state. Set up A unmuted / B
muted once and each press swaps which chain you hear.

## Architecture

Same two-runtime shape as SequenceBatchExporter (see its CLAUDE.md for the
shared environment gotchas):

- **Panel** — `index.html` + `js/main.js`. Checked-track selection is keyed
  by `sequenceID`, so each sequence keeps its own A/B setup. Since v1.0.1 it is
  written to `%APPDATA%\com.tohare.abaudiotoggle\state.json` through CEP's
  built-in `window.cep.fs`, mirrored to `localStorage` (`abt_state_v1`) as a
  fallback and migrated from it once. localStorage alone lost the data on
  every Premiere upgrade (cep_cache is keyed by host version). No Node needed;
  manifest has no CEFCommandLine.
- **ExtendScript host** — `jsx/host.jsx`, functions prefixed `ABT_`
  (ExtendScript engine is shared with other panels). Hand-built JSON returns.
  API surface: `audioTracks[i].isMuted()` / `.setMute(0|1)` — standard DOM,
  no QE.

- **Update check** — `js/update-check.js`, configured by `data-repo` and
  `data-url` on its script tag. Once a day it compares
  `ExtensionBundleVersion` (read from `CSXS/manifest.xml`) with the latest
  GitHub release tag and shows a dismissible notice that opens the Gumroad
  listing. The same file is copied into SBE, Spec Check and A/B Toggle; keep the
  copies identical. A release is only "out" once the GitHub release exists,
  so tag names must stay `v<version>`.

## Behaviors worth knowing

- Track mute ≠ clip mute: muting a track silences everything on it, and mute
  state saves with the project. "Unmute All" is the reset.
- `ABT_toggle` re-snapshots after flipping; the panel warns if the active
  sequence changed between render and press (indices would have hit the new
  sequence's tracks).
- Panel refreshes on window focus to pick up timeline-side mute changes; there
  is no polling, so states can go stale while Premiere has focus. Refresh
  button re-syncs.
- `setMute()` is not on the undo stack (mute is sequence state, not an edit).

## Release

Same pipeline as SequenceBatchExporter (see its CLAUDE.md for full detail):
bump both versions in `CSXS/manifest.xml` → `.\build.ps1` (signs with the
shared TOP cert, auto-copied from `SequenceBatchExporter\cert` — that folder
is still the cert's backup home) → commit + tag on **Gitea** (origin/source of
truth; push mirror on-commit + 8h carries to GitHub, never push GitHub
directly) → GitHub release on the mirrored tag with the `.zxp` attached.
v1.0.0 shipped 2026-08-26: https://github.com/tro2789/ABAudioToggle/releases

## Dev loop

`.\install.ps1` (ASCII-only, PS 5.1) → restart Premiere → Window > Extensions >
A/B Audio Toggle. Installs to
`%APPDATA%\Adobe\CEP\extensions\com.tohare.abaudiotoggle`; PlayerDebugMode
already set on this machine.
