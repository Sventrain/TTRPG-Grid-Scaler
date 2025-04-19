const { app, BrowserWindow } = require('electron');
const path = require('path');

//Function to create initial window with program in it. 
function createWindow() {
  const mainWindow = new BrowserWindow({
    minWidth: 1470,
    minHeight: 1050,
    center: true, 
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // Load the built Vite app
  mainWindow.loadURL(`file://${path.join(__dirname, '..', 'dist', 'index.html')}`);
}

app.whenReady().then(createWindow);