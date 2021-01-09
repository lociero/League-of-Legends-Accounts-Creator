import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';
import open from 'open';
import server from './express/express.js';
import { isDev } from '../constants/constants.js';
import createCustomFiles from './customFiles.js';

const express = server().listen(0, () => {
  global.expressPort = express.address().port;
});

if (!isDev) {
  createCustomFiles();
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1270,
    height: 842,
    minWidth: 1270,
    minHeight: 842,
    frame: false,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
    },
  });

  // mainWindow.setMenu(null);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('web-contents-created', (_event, contents) => {
  contents.on('new-window', (e, urlLink) => {
    e.preventDefault();
    open(urlLink);
  });
  contents.on('will-navigate', (e, urlLink) => {
    if (urlLink !== contents.getURL()) {
      e.preventDefault();
      open(urlLink);
    }
  });
});

app.allowRendererProcessReuse = true;
