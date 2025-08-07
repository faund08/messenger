  import { contextBridge, ipcRenderer } from 'electron'

  contextBridge.exposeInMainWorld('auth', {
    saveToken: (token: string) => ipcRenderer.invoke('auth:saveToken', token),
    getToken: () => ipcRenderer.invoke('auth:getToken'),
    clearToken: () => ipcRenderer.invoke('auth:clearToken'),
  });

  contextBridge.exposeInMainWorld('api', {
    sendMessege: (channel: string, data: any) => {
      ipcRenderer.send(channel, data);
    },
    onReceive: (channel: string, callback: (data: any) => void) => {
      ipcRenderer.on(channel, (_, data) => callback(data));
    },
    selectFile: () => ipcRenderer.invoke('dialog:openfile'),
  });