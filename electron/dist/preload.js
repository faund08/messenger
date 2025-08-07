"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('auth', {
    saveToken: (token) => electron_1.ipcRenderer.invoke('auth:saveToken', token),
    getToken: () => electron_1.ipcRenderer.invoke('auth:getToken'),
    clearToken: () => electron_1.ipcRenderer.invoke('auth:clearToken'),
});
electron_1.contextBridge.exposeInMainWorld('api', {
    sendMessege: (channel, data) => {
        electron_1.ipcRenderer.send(channel, data);
    },
    onReceive: (channel, callback) => {
        electron_1.ipcRenderer.on(channel, (_, data) => callback(data));
    },
    selectFile: () => electron_1.ipcRenderer.invoke('dialog:openfile'),
});
