"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToken = saveToken;
exports.getToken = getToken;
exports.clearToken = clearToken;
const electron_1 = require("electron");
const path = __importStar(require("path"));
const electron_updater_1 = require("electron-updater");
const keytar_1 = __importDefault(require("keytar"));
const electron_2 = require("electron");
const SERVICE_NAME = 'Nimbus';
const ACCOUNT_NAME = 'auth-token';
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'dist/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    const isDev = !electron_1.app.isPackaged;
    if (isDev) {
        win.loadURL('http://localhost:3000');
    }
    else {
        win.loadFile(path.join(__dirname, '../web/out/index.html'));
    }
    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    isDev
                        ? "default-src 'self' http://localhost:3000"
                        : "default-src 'self'; script-src 'self'; object-src 'none'",
                ],
            },
        });
    });
};
async function saveToken(token) {
    await keytar_1.default.setPassword(SERVICE_NAME, ACCOUNT_NAME, token);
}
async function getToken() {
    return await keytar_1.default.getPassword(SERVICE_NAME, ACCOUNT_NAME);
}
async function clearToken() {
    await keytar_1.default.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
}
electron_2.ipcMain.handle('auth:saveToken', async (_event, token) => {
    return await saveToken(token);
});
electron_2.ipcMain.handle('auth:getToken', async () => {
    return await getToken();
});
electron_2.ipcMain.handle('auth:clearToken', async () => {
    return await clearToken();
});
electron_1.app.whenReady().then(() => {
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
});
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
