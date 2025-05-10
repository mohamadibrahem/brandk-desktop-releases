import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';

let win: BrowserWindow | null;
let tray: Tray | null = null;

console.log('🚀 main.ts: Electron بدأ العمل');

function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 900,
    icon: path.join(__dirname, '../../src/assets/img/logo_brandk_icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:3000');

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(() => {
  try {
    tray = new Tray(path.join(__dirname, '../../src/assets/img/logo_brandk_icon.ico'));

    tray.setToolTip('BRANDK ONLINE');

    tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: 'Open App',
        click: () => createWindow()
      },
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ]));
  } catch (error) {
    console.error('Error loading tray icon:', error);
  }

  createWindow();

  // ✅ التحقق من وجود تحديثات
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    win?.webContents.send('update_available');
  });

  autoUpdater.on('update-downloaded', () => {
    win?.webContents.send('update_downloaded');
  });

  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
