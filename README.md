# A/B Audio Toggle

[![Latest release](https://img.shields.io/github/v/release/tro2789/ABAudioToggle)](https://github.com/tro2789/ABAudioToggle/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/tro2789/ABAudioToggle/total)](https://github.com/tro2789/ABAudioToggle/releases)
[![License: MIT](https://img.shields.io/github/license/tro2789/ABAudioToggle)](LICENSE)
![Platform: Windows](https://img.shields.io/badge/platform-Windows-0078d4)
![Premiere Pro 22.0+](https://img.shields.io/badge/Premiere%20Pro-22.0%2B-9999ff)
[![Buy me a coffee](https://img.shields.io/badge/%E2%98%95%20buy%20me%20a%20coffee-tip-ffdd00)](https://buy.stripe.com/5kQ6oH5Lybfs2BI091bwk0d)

A/B Audio Toggle is a CEP panel for Adobe Premiere Pro. You select audio
tracks in the panel. You push one button. The panel changes the mute state
of each selected track. Use the panel to compare two audio chains, for
example an unprocessed voice track and a processed voice track.

## Install the panel (users)

1. Download the `.zxp` file from the
   [latest release](https://github.com/tro2789/ABAudioToggle/releases/latest).
2. Open the file with [ZXPInstaller](https://zxpinstaller.com).
3. Restart Premiere Pro.
4. Open the panel: **Window > Extensions > A/B Audio Toggle**.

The panel operates on Windows with Premiere Pro 22.0 or later.

## Install the panel (development)

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

The script copies the files to `%APPDATA%\Adobe\CEP\extensions`. The script
sets `PlayerDebugMode` to `1` under `HKCU\Software\Adobe\CSXS.11/.12`. Run
the script again after each code change. Then restart Premiere Pro.

## Use the panel

1. Open a sequence. The panel shows each audio track with its mute state
   (LIVE or MUTED).
2. Set a check mark on each track that you want in the A/B group. The panel
   keeps the selection for each sequence.
3. Set the start condition. Mute the tracks of chain B. Keep the tracks of
   chain A live. Use the **TOGGLE A/B** button or the track mute buttons in
   the timeline. If you use the timeline, push **Refresh**.
4. Push **TOGGLE A/B**. The mute state of each selected track changes. You
   now hear the other chain. The button operates during playback.
5. Push **TOGGLE A/B** again to go back to the first chain.

Notes:

- Track mute is not clip mute. Track mute makes the full track silent.
  Premiere Pro keeps the mute state in the project file.
- Push **Unmute All** to remove the mute state from all audio tracks. Do
  this before an export if a muted chain must be in the mix.
- The panel reads the track states again when the panel gets focus. Push
  **Refresh** to read the states again at all other times.

## Build the release file

```powershell
.\build.ps1
```

The script makes the file `dist\ABAudioToggle-v<version>.zxp`. The script
signs the file with the **Trevor O'Hare Productions** certificate and adds a
timestamp. The certificate is not in git. The script copies the certificate
from `SequenceBatchExporter\cert` if the local copy is not present.

Increase the two version values in `CSXS/manifest.xml` before each release.
The script names the `.zxp` file from the manifest version.

## Repositories and releases

- **Source of truth:** the private Gitea. Push all commits and tags there.
  A push mirror sends them to GitHub (on each commit, and each 8 hours).
- **Public mirror and releases:**
  `https://github.com/tro2789/ABAudioToggle`. Do not push to GitHub
  directly. Make each release on GitHub and attach the signed `.zxp` file.

## Files

- `CSXS/manifest.xml` — the CEP manifest (PPRO 22–99, CSXS 9+)
- `jsx/host.jsx` — ExtendScript: `isMuted()` and `setMute()` on `audioTracks`
- `index.html`, `js/main.js` — the panel UI and logic
- `install.ps1` — the development install script
- `build.ps1` — the signed `.zxp` release build

## Update check

When the panel opens, it checks for a new version one time each day. It sends
one request to the GitHub API (`api.github.com/repos/tro2789/ABAudioToggle/releases/latest`).
GitHub can see your IP address. The panel sends no other data. If a new
version is available, a notice shows at the top of the panel. Click the notice
to open the download page. Click the x to hide the notice until the next version.

## Support

A/B Audio Toggle is free and stays free. If the panel helps you, you can
[buy me a coffee](https://buy.stripe.com/5kQ6oH5Lybfs2BI091bwk0d).

## License

MIT — see [LICENSE](LICENSE).
