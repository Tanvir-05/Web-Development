const { contextBridge } = require('electron');

// Expose minimal safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  
  platform: process.platform,
  
  appVersion: '1.0.0'
});
