import getRandomInt from './utils';

// const { app } = window.require('electron').remote;
const { remote } = window.require('electron');
const fs = remote.require('fs').promises;
const { getGlobal } = window.require('electron').remote;

const crlf = (text) => text.replace(/\r\n|\r(?!\n)|\n/g, '\n');
const currDir = getGlobal('process').env.PORTABLE_EXECUTABLE_DIR;

const getEmailMasks = async () => {
  const emailsList = await fs
    .readFile(`${currDir}/email_masks.txt`, 'utf-8')
    .catch(() => 'emails_list_is_empty');
  const emails = crlf(emailsList).split('\n').filter(Boolean);
  return emails;
};

const getRandomEmailMask = async () => {
  const emails = await getEmailMasks();
  const { length } = emails;
  const index = getRandomInt(0, length - 1);
  return emails[index] || '@gmail.com';
};

export default getRandomEmailMask;
