const fs = require('fs').promises;

const currDir = process.env.PORTABLE_EXECUTABLE_DIR;

const makeConfig = async () => {
  const emailMasks = await fs.readFile(`${currDir}/email_masks.txt`, 'utf-8').catch(() => null);
  const existedEmails = await fs
    .readFile(`${currDir}/existed_emails.txt`, 'utf-8')
    .catch(() => null);

  if (!emailMasks) {
    await fs.writeFile(
      `${currDir}/email_masks.txt`,
      ['@example.com', '-boop@example2.com'].join('\n'),
      'utf-8',
    );
  }
  if (!existedEmails) {
    await fs.writeFile(
      `${currDir}/existed_emails.txt`,
      ['example@gmail.com', 'example2@hotmail.com'].join('\n'),
      'utf-8',
    );
  }
};

module.exports = makeConfig;
