import { promises as fs } from 'fs';
import { dirname, FILE_NAMES } from '../constants/constants.js';

export default async () => {
  await fs.mkdir(`${dirname}/accounts`).catch(() => null);
  const customEmails = await fs.readFile(`${dirname}/${FILE_NAMES.CUSTOM_EMAILS}`, 'utf-8').catch(() => null);
  const customUsernames = await fs.readFile(`${dirname}/${FILE_NAMES.CUSTOM_USERNAMES}`, 'utf-8').catch(() => null);
  const config = await fs.readFile(`${dirname}/config.json`, 'utf-8').catch(() => null);

  if (!customEmails) {
    await fs.writeFile(
      `${dirname}/${FILE_NAMES.CUSTOM_EMAILS}`,
      ['email@example.com', 'boop@example2.com'].join('\n'),
      'utf-8'
    );
  }
  if (!customUsernames) {
    await fs.writeFile(`${dirname}/${FILE_NAMES.CUSTOM_USERNAMES}`, ['Faker', 'Darien'].join('\n'), 'utf-8');
  }
  if (!config) {
    await fs.writeFile(`${dirname}/${FILE_NAMES.CONFIG}`, '{}', 'utf-8');
  }
};
