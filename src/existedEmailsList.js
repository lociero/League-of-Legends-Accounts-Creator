const { app } = window.require('electron').remote;
const { remote } = window.require('electron');
const fs = remote.require('fs').promises;

const crlf = (text) => text.replace(/\r\n|\r(?!\n)|\n/g, '\n');

export const getExistedEmailsList = async () => {
  const currDir = app.getAppPath();
  const emailsList = await fs
    .readFile(`${currDir}/../../existedEmails.txt`, 'utf-8')
    .catch(() => 'none');
  const emails = crlf(emailsList).split('\n').filter(Boolean).slice(4);
  return emails;
};

export const saveEmails = async (list) => {
  const line1 = 'example@gmail.com  // example';
  const line2 = 'example2@gmail.com // these 4 lines';
  const line3 = 'example3@yahoo.com // are always ignored';
  const line4 = '----add-your-emails-under-this-line----';
  const currDir = app.getAppPath();
  await fs
    .writeFile(
      `${currDir}/../../existedEmails.txt`,
      [line1, line2, line3, line4, ...list].join('\n'),
      'utf-8',
    )
    // eslint-disable-next-line no-console
    .catch(console.log);
};
