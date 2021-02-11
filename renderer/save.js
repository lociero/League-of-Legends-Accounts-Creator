import { promises as fs } from 'fs';
import { readAndParse, getDate } from '../utils/utils.js';
import { dirname, FILE_NAMES, STATUS } from '../constants/constants.js';

export default async (accounts, state) => {
  const configPath = `${dirname}/${FILE_NAMES.CONFIG}`;
  const { proxyList, ...configToSave } = state;
  await fs.writeFile(configPath, JSON.stringify(configToSave, null, 2), 'utf-8');

  const successAccounts = accounts.filter(({ status }) => status === STATUS.ACCOUNT.SUCCESS);
  if (successAccounts.length < 1) {
    return;
  }

  const emailsList = readAndParse(FILE_NAMES.CUSTOM_EMAILS);
  const successEmails = successAccounts.map(({ email }) => email);
  const emailsToSave = emailsList.filter((email) => !successEmails.includes(email));

  await fs.writeFile(`${dirname}/${FILE_NAMES.CUSTOM_EMAILS}`, emailsToSave.join('\n'), 'utf-8');

  const usernamesList = readAndParse(FILE_NAMES.CUSTOM_USERNAMES);
  const successUsernames = successAccounts.map(({ username }) => username);
  const usernamesToSave = usernamesList.filter((username) => !successUsernames.includes(username));

  await fs.writeFile(`${dirname}/${FILE_NAMES.CUSTOM_USERNAMES}`, usernamesToSave.join('\n'), 'utf-8');

  const accountsToSave = successAccounts.map(({ server, username, password, email, birth, accountId, proxy }) => ({
    full: `${server}:${username}:${password}:${email} accountId: ${accountId} date_of_birth: ${birth} proxy: ${proxy}`,
    compact: `${server}:${username}:${password}`,
  }));

  const [{ server }] = accounts;

  const fullPath = `${dirname}/accounts/${server}_FULL_${getDate()}.txt`;
  const compactPath = `${dirname}/accounts/${server}_COMPACT_${getDate()}.txt`;
  const fullInfo = await fs.readFile(fullPath, 'utf-8').catch(() => null);
  const compactInfo = await fs.readFile(compactPath, 'utf-8').catch(() => null);
  const fullInfoToSave = [fullInfo, ...accountsToSave.map((info) => info.full)].filter(Boolean).join('\n');
  const compactInfoToSave = [compactInfo, ...accountsToSave.map((info) => info.compact)].filter(Boolean).join('\n');
  await fs.writeFile(fullPath, fullInfoToSave, 'utf-8');
  await fs.writeFile(compactPath, compactInfoToSave, 'utf-8');
};
