"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let win;
let tray = null;
console.log('🚀 main.ts: Electron بدأ العمل');
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1500,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
    });
    win.loadURL('http://localhost:3000');
    win.on('closed', () => {
        win = null;
    });
}
electron_1.app.whenReady().then(() => {
    try {
        tray = new electron_1.Tray(path_1.default.join(__dirname, '../../src/assets/img/logo_brandk_icon.ico'));
        tray.setToolTip('BRANDK ONLINE');
        tray.setContextMenu(electron_1.Menu.buildFromTemplate([
            {
                label: 'Open App',
                click: () => createWindow()
            },
            {
                label: 'Quit',
                click: () => electron_1.app.quit()
            }
        ]));
    }
    catch (error) {
        console.error('Error loading tray icon:', error);
    }
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map