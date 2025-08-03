import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  sendMessege: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  onReceive: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
  selectFile: () => ipcRenderer.invoke('dialog:openfile'),
});