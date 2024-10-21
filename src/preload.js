const { contextBridge, ipcRenderer } = require('electron');

// Expose the ipcRenderer methods to the frontend
contextBridge.exposeInMainWorld('electronAPI', {
  chooseDirectory: () => ipcRenderer.invoke('open-directory')
});
