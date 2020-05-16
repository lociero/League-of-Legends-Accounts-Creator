import getRandomInt from './utils';

const { app } = window.require('electron').remote;
const { remote } = window.require('electron');
const fs = remote.require('fs').promises;

const crlf = (text) => text.replace(/\r\n|\r(?!\n)|\n/g, '\n');

const getEmailMasks = async () => {
  const currDir = app.getAppPath();
  const emailsList = await fs
    .readFile(`${currDir}/../../emailMasks.txt`, 'utf-8')
    .catch(() => undefined);
  const emails = crlf(emailsList).split('\n').filter(Boolean);
  return emails;
};

const getRandomEmailMask = async () => {
  const emails = await getEmailMasks();
  const { length } = emails;
  const index = getRandomInt(0, length - 1);
  return emails[index];
};

export default getRandomEmailMask;
