const { app, BrowserWindow, WebContentsView, Tray, Menu, ipcMain, nativeImage, shell } = require('electron');
const path = require('node:path');
const { commands, isMusicUrl, isAccountUrl } = require('./controls');

let window, music, tray;
let quitting = false;
const musicHome = 'https://music.youtube.com/';
const partition = 'persist:youtube-music';

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', showWindow);
  app.whenReady().then(createPlayer);
}

function showWindow() {
  if (!window) return;
  if (window.isMinimized()) window.restore();
  window.show();
  window.focus();
}

async function control(command) {
  if (!music || !isMusicUrl(music.webContents.getURL()) || !commands[command]) return;
  try { await music.webContents.executeJavaScript(commands[command], true); }
  catch (error) { console.error('Playback control failed:', error.message); }
}

function navigate(destination) {
  const routes = { home: '', library: 'library', likes: 'playlist?list=LM' };
  if (Object.hasOwn(routes, destination)) music.webContents.loadURL(musicHome + routes[destination]).catch(reportLoadError);
}

function reportLoadError(error) {
  if (error.code !== 'ERR_ABORTED') console.error('YouTube Music failed to load:', error.message);
}

function createPlayer() {
  window = new BrowserWindow({
    width: 1040, height: 760, minWidth: 660, minHeight: 480,
    title: 'Tube Music Player', backgroundColor: '#101114',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  window.setMenu(null);
  window.loadFile(path.join(__dirname, 'index.html'));
  music = new WebContentsView({ webPreferences: {
    partition, contextIsolation: true, nodeIntegration: false, sandbox: true
  }});
  window.contentView.addChildView(music);
  function resize() {
    const [width, height] = window.getContentSize();
    music.setBounds({ x: 0, y: 62, width, height: Math.max(0, height - 62) });
  }
  window.on('resize', resize);
  resize();

  // Chromium forwards the site's Media Session to Windows system media controls.
  // Keep the renderer alive when the window is hidden in the tray.
  music.webContents.setBackgroundThrottling(false);
  music.webContents.setWindowOpenHandler(({ url }) => {
    if (isAccountUrl(url) || isMusicUrl(url)) return {
      action: 'allow', overrideBrowserWindowOptions: {
        autoHideMenuBar: true,
        webPreferences: { partition, contextIsolation: true, nodeIntegration: false, sandbox: true }
      }
    };
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  music.webContents.on('will-navigate', (event, url) => {
    if (!isMusicUrl(url) && !isAccountUrl(url)) {
      event.preventDefault();
      if (url.startsWith('https://')) shell.openExternal(url);
    }
  });
  music.webContents.session.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  music.webContents.loadURL(musicHome).catch(reportLoadError);

  ipcMain.on('player-action', (event, action) => {
    if (event.sender !== window.webContents || event.senderFrame !== window.webContents.mainFrame) return;
    if (Object.hasOwn(commands, action)) control(action);
    else if (action === 'tray') window.hide();
    else if (action === 'reload') music.webContents.reload();
    else navigate(action);
  });

  const icon = nativeImage.createFromPath(path.join(__dirname, '..', 'assets', 'tray.png'));
  tray = new Tray(icon);
  tray.setToolTip('Tube Music Player');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open player', click: showWindow },
    { type: 'separator' },
    { label: 'Play / pause', click: () => control('play') },
    { label: 'Previous track', click: () => control('previous') },
    { label: 'Next track', click: () => control('next') },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]));
  tray.on('double-click', showWindow);
  tray.on('click', showWindow);
  window.on('minimize', (event) => { event.preventDefault(); window.hide(); });
  window.on('close', (event) => { if (!quitting) { event.preventDefault(); window.hide(); } });
}

app.on('before-quit', () => { quitting = true; });
app.on('window-all-closed', () => { if (quitting) app.quit(); });
