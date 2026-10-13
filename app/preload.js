const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('player', {
  action: (name) => ipcRenderer.send('player-action', name)
});
