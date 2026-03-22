const { app, BrowserWindow } = require('electron');
const path = require('path');

console.log("App starting...");

function createWindow() {
  console.log("Creating window...");

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true, // force show
  });

  const filePath = path.join(__dirname, 'dist/index.html');
  console.log("Loading file:", filePath);

  win.loadFile(filePath);

  win.webContents.openDevTools(); // IMPORTANT

  win.on('ready-to-show', () => {
    console.log("Window ready");
    win.show();
  });
}

app.whenReady().then(() => {
  console.log("App ready");
  createWindow();
});

app.on('window-all-closed', () => {
  console.log("All windows closed");
  if (process.platform !== 'darwin') app.quit();
});