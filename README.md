# Tube Music Player

A small Windows desktop shell for your YouTube Music account. Home shows your personalized mixes; Library shows playlists; Favorites opens liked songs. YouTube Music supplies the music interface, playback, and account features.

## Run on Windows

1. On [GitHub](https://github.com/koushahashemi/YouTubeWinApp), choose **Code > Download ZIP**, then **Extract All**. You must extract the files before running a BAT file. Alternatively, use `git clone https://github.com/koushahashemi/YouTubeWinApp.git`.
2. Double-click **Build EXE.bat** inside the extracted folder. It downloads a private Node.js runtime, installs the build tools, runs the control tests, builds the app, and opens the output folder. No administrator privileges should be needed.
3. Run `dist/TubeMusicPlayer-1.0.0.exe` and sign in to YouTube Music.

You can keep Node.js 12 installed, or have no Node.js installation at all. Both launchers use a private Node.js 24.21.0 runtime under `.tools/node`, verify its ZIP against the official SHA-256 checksum, and temporarily put it first in PATH only for that launcher. Your global Node/npm installation and system PATH remain unchanged. This requires x64 Windows and Windows PowerShell 5.1 or newer (included with Windows 10/11). The downloaded runtime is reused on later launches. This supports building alongside Node 12; the modern Electron tooling itself runs under the private Node 24 runtime.

To run directly from source, double-click **Start Player.bat** instead. The first launch downloads dependencies. Your session stays in the app's local Electron profile; the app does not ask for your password separately.

To make a standalone executable, double-click **Build EXE.bat**. Open `dist/TubeMusicPlayer-1.0.0.exe`. The EXE runs without Node.js installed. This is an unsigned portable build; Windows may show a publisher warning.

### If your firewall blocks downloads

The repository contains source and a small tray icon, with no EXE files. Local builds download the private runtime ZIP from `nodejs.org`, dependencies from `registry.npmjs.org`, and Electron/packaging archives from GitHub release servers, including `github.com` and `release-assets.githubusercontent.com`. Those archives contain executables. If your firewall blocks them too, ask your network administrator to allow the required downloads or build on a permitted connection. Building locally does not bypass a network restriction. If a build fails, the BAT file keeps its error message visible.

### If npm says "Cannot read property 'electron' of undefined"

Older npm versions can fail on this project's version 3 lockfile with this error. Download the updated source and use **Build EXE.bat**; it automatically uses its private modern runtime. Running `npm ci` directly with your global npm 6 still fails. Direct command-line development requires Node.js 22.12 or newer and npm 10 or newer.

If the check still reports old versions, run `where node`, `where npm`, `node -v`, and `npm -v` in Command Prompt. A standalone npm installation under `%APPDATA%\npm` or another old Node installation may take precedence over the new installation. Remove the outdated installation or correct its PATH entry. Do not delete the project's lockfile; `npm ci` uses it to reproduce the tested dependencies.

## Controls

- Home, Library, and Favorites switch between your music collections.
- Previous, play/pause, and next control the active YouTube Music player.
- Minimize, close, or **Tray** hides the window and keeps music playing.
- Click the tray icon to return. Its menu includes playback controls and **Quit**.
- Chromium exposes YouTube Music's Media Session to Windows media controls and media keys while a track is active. Availability depends on the site's playback state and Windows; another active media application may receive the keys.
- The reload button retries loading after a network interruption.

Internet access is required. Subscription rules and ads follow your YouTube Music account. Google may restrict sign-in in embedded browsers; if it rejects this app, account integration needs a different supported sign-in approach. Do not paste account cookies or passwords into project files.

## Development

Run `npm ci`, `npm start`, and `npm test`. `npm run dist:win` creates the portable x64 Windows executable. Linux can package it, but Windows is needed to verify tray behavior, sign-in, audio, and system media controls. Remote pages are sandboxed with Node.js disabled and have no access to the app's preload bridge.

## Windows acceptance check

1. Launch the EXE and sign in. Confirm Library, Favorites, and Home mixes belong to your account.
2. Play a track, then use the toolbar and keyboard media keys. Confirm Windows media controls show the track and can pause/resume it.
3. Minimize and close the window. Confirm playback continues and the tray controls work.
4. Reopen from the tray, quit from its menu, and relaunch. Confirm the account session persists.

These Windows checks must be performed on Windows; unit tests alone do not verify account playback.
