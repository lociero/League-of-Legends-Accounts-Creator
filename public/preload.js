const path = require('path');
const url = require('url');

const customTitlebar = require('custom-electron-titlebar');

window.addEventListener('DOMContentLoaded', () => {
  const titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#1f2d3a'),
    icon: url.format(path.join(__dirname, '/electron-logo.png')),
    titleHorizontalAlignment: 'left',
    menu: null,
    maximizable: false,
  });
  titlebar.updateTitle('League of Legends Accounts Creator');

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };
  ['chrome', 'node', 'electron'].forEach(type =>
    replaceText(`${type}-version`, process.versions[type]),
  );
});
