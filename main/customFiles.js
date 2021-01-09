import { promises as fs } from 'fs';
import { dirname } from '../constants/constants.js';

export default async () => {
  await fs.mkdir(`${dirname}/accounts`).catch(() => null);
  const customEmails = await fs.readFile(`${dirname}/custom_emails.txt`, 'utf-8').catch(() => null);
  const customUsernames = await fs.readFile(`${dirname}/custom_usernames.txt`, 'utf-8').catch(() => null);
  const config = await fs.readFile(`${dirname}/config.json`, 'utf-8').catch(() => null);

  if (!customEmails) {
    await fs.writeFile(`${dirname}/custom_emails.txt`, ['email@example.com', 'boop@example2.com'].join('\n'), 'utf-8');
  }
  if (!customUsernames) {
    await fs.writeFile(`${dirname}/custom_usernames.txt`, ['Faker', 'Darien'].join('\n'), 'utf-8');
  }
  if (!config) {
    await fs.writeFile(`${dirname}/config.json`, '{}', 'utf-8');
  }
};
