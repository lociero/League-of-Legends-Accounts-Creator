// const { app } = window.require('electron').remote;
const { remote } = window.require('electron');
const fs = remote.require('fs').promises;
const { getGlobal } = window.require('electron').remote;

const crlf = (text) => text.replace(/\r\n|\r(?!\n)|\n/g, '\n');
const currDir = getGlobal('process').env.PORTABLE_EXECUTABLE_DIR;

export const getExistedEmailsList = async () => {
  const emailsList = await fs
    .readFile(`${currDir}/existed_emails.txt`, 'utf-8')
    .catch(() => 'emails_list_is_empty');
  const emails = crlf(emailsList).split('\n').filter(Boolean);
  return emails;
};

export const saveEmails = async (list) => {
  await fs
    .writeFile(`${currDir}/existed_emails.txt`, list.join('\n'), 'utf-8')
    // eslint-disable-next-line no-console
    .catch(console.log);
};
