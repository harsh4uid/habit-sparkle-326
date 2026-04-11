const { app, BrowserWindow } = require('electron');
const path = require('path');

console.log("App starting...");

function createWindow() {
  console.log("Creating window...");

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Wait until ready-to-show
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Since main.cjs is in root, 'dist/index.html' is correct
  const filePath = path.join(__dirname, 'dist', 'index.html');
  console.log("Loading file:", filePath);

  win.loadFile(filePath).catch(err => console.error("Failed to load file:", err));

  // win.webContents.openDevTools(); // Uncomment to debug

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
