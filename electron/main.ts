import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { autoUpdater } from 'electron-updater';


import keytar from 'keytar'
import { access } from 'fs';
import { ipcMain } from 'electron';


const SERVICE_NAME = 'Nimbus';
const ACCOUNT_NAME = 'auth-token';


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'dist/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
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


export async function saveToken(token: string) {
  await keytar.setPassword(SERVICE_NAME,ACCOUNT_NAME, token);
}

export async function getToken(): Promise<string | null> {
  return await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
}

export async function clearToken() {
  await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
}


ipcMain.handle('auth:saveToken', async (_event, token: string) => {
  return await saveToken(token);
});

ipcMain.handle('auth:getToken', async () => {
  return await getToken();
});

ipcMain.handle('auth:clearToken', async () => {
  return await clearToken();
});


app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
