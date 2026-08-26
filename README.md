# A/B Audio Toggle

CEP panel for Premiere Pro: check some audio tracks, press one big button, and
every checked track flips its mute state. Set up chain A unmuted and chain B
muted once, and each press swaps which one you hear — instant A/B comparison
of processed vs. unprocessed audio without touching the timeline.

## Install (users)

Download the signed `.zxp` from the
[latest release](https://github.com/tro2789/ABAudioToggle/releases/latest)
and open it with [ZXPInstaller](https://zxpinstaller.com). Restart Premiere →
**Window > Extensions > A/B Audio Toggle**. Windows, Premiere Pro 22.0+.

## Install (development)

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

Copies the working tree to `%APPDATA%\Adobe\CEP\extensions` as an unsigned
panel and sets `PlayerDebugMode=1` under `HKCU\Software\Adobe\CSXS.11/.12`.
Re-run after any code change, then restart Premiere.

## Usage

1. Check the audio tracks you want in the A/B group. Each track shows its live
   mute state (LIVE / MUTED). Selection is remembered per sequence.
2. Set your starting point (e.g. mute the processed track, leave the raw one
   live) — in the panel via **TOGGLE A/B** or directly in the timeline, then
   **Refresh**.
3. Press **TOGGLE A/B** (Space/Enter works while it has focus) — every checked
   track flips its mute state, swapping which chain is audible. Works during
   playback.
4. **Unmute All** resets every audio track to unmuted.

Notes:

- Track mute is not clip mute: it silences the whole track and saves with the
  project. Use Unmute All before exporting if you left a B-chain muted.
- The panel re-reads track states when it regains focus; if you change mutes in
  the timeline while working, hit Refresh to re-sync.

## Distribution (signed .zxp)

```powershell
.\build.ps1
```

Produces `dist\ABAudioToggle-v<version>.zxp`, signed and timestamped as
**Trevor O'Hare Productions** (same cert as the other panels; copied from
`SequenceBatchExporter\cert` on first run, gitignored). Users install it with
[ZXPInstaller](https://zxpinstaller.com) — no PlayerDebugMode / registry edits.

Bump `ExtensionBundleVersion` and the extension `Version` in
`CSXS/manifest.xml` for each release; build.ps1 names the .zxp from it.

## Repos and releases

- **Source of truth:** `https://gitea.tohareprod.com/tro2789/ABAudioToggle`
  (private). Always push here — commits and tags auto-mirror to GitHub.
- **Public mirror + releases:** `https://github.com/tro2789/ABAudioToggle`.
  Never push to GitHub directly. Releases are created on GitHub with the signed
  `.zxp` attached.

## Files

- `CSXS/manifest.xml` — CEP manifest (PPRO 22–99, CSXS 9+)
- `jsx/host.jsx` — ExtendScript: `isMuted()` / `setMute()` over `audioTracks`
- `index.html` / `js/main.js` — panel UI and logic
- `install.ps1` — dev install: copy to `%APPDATA%\Adobe\CEP\extensions` + debug-mode keys
- `build.ps1` — signed `.zxp` release build (see Distribution)
