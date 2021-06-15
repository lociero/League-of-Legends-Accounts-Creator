import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import url from 'url';
import open from 'open';
import Promise from 'bluebird';
import server from './express/express.js';
import { isDev } from '../constants/constants.js';
import createCustomFiles from './customFiles.js';

Promise.config({
  cancellation: true,
});
global.Promise = Promise;

const express = server().listen(0, () => {
  global.expressPort = express.address().port;
});

if (!isDev) {
  createCustomFiles();
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1270,
    height: 750,
    minWidth: 1270,
    minHeight: 750,
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

  // https://github.com/electron/electron/issues/24910
  mainWindow.on('close', mainWindow.destroy);
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

// Main process errors *handling*
process.on('uncaughtException', (err) => {
  const messageBoxOptions = {
    type: 'error',
    title: 'Something went wrong',
    message: ['If you have no idea what happened contact me on Discord: megaded#1529', err.stack].join('\n'),
  };
  dialog.showMessageBox(messageBoxOptions);
  // throw err;
});
