const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path');
const actionManager = require('./core/actionManager');
require('./controllers/main');

const isDev = process.env.env === 'dev'
const PORT = process.env.PORT || 3000

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration:true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false
    },
  });

  // and load the index.html of the app.
  if (isDev) {
  	mainWindow.loadURL(`http://localhost:${PORT}`);
    mainWindow.webContents.openDevTools();
  } else {
  	mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));  
  }

  // Open the DevTools.
};

ipcMain.on('init', (e) => {
  e.reply('init', actionManager.pool)
})

app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
