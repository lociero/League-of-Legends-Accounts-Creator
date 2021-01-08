import { Titlebar, Color } from 'custom-electron-titlebar';
import packageInfo from '../package.json';
import icon from './imgs/icon.ico';

export default () => {
  window.addEventListener('DOMContentLoaded', () => {
    const titlebar = new Titlebar({
      backgroundColor: Color.fromHex('#e9ecef'),
      icon, // url.format(path.join(__dirname, '/icon.ico')),
      titleHorizontalAlignment: 'left',
      menu: null,
    });
    titlebar.updateTitle(`League of Legends Accounts Creator v${packageInfo.version} by megaded`);

    const replaceText = (selector, text) => {
      const element = document.getElementById(selector);
      if (element) element.innerText = text;
    };
    ['chrome', 'node', 'electron'].forEach((type) => replaceText(`${type}-version`, process.versions[type]));
  });
};
