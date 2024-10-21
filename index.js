const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

// Include this function to handle directory selection
const openDirectoryDialog = async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  return result.filePaths[0]; // Return the selected directory path
};

// Expose the dialog function to preload.js
ipcMain.handle('open-directory', openDirectoryDialog);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src', 'preload.js'), // Correct path to preload.js
      nodeIntegration: false, // Ensure this is set to false for security
      contextIsolation: true, // Ensure this is set to true for security
    },
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
