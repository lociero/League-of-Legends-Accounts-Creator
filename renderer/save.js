import { promises as fs } from 'fs';
import { readAndParse } from '../utils/utils.js';
import { dirname, FILE_NAMES } from '../constants/constants.js';

const getDate = () => {
  const today = new Date();
  const dd = `${today.getDate()}`.padStart(2, '0');
  const mm = `${today.getMonth() + 1}`.padStart(2, '0');
  const yyyy = today.getFullYear();

  return `${dd}_${mm}_${yyyy}`;
};

export default async (accounts, state) => {
  const emailsList = readAndParse(FILE_NAMES.CUSTOM_EMAILS);
  const customSuccessEmails = accounts
    .filter(({ status }) => status === 'SUCCESS')
    .filter(({ username, email }) => !email.includes(username))
    .map(({ email }) => email);
  const emailsToSave = emailsList.filter((email) => !customSuccessEmails.includes(email));

  await fs.writeFile(`${dirname}/${FILE_NAMES.CUSTOM_EMAILS}`, emailsToSave.join('\n'), 'utf-8');

  const accountsToSave = accounts
    .filter(({ status }) => status === 'SUCCESS')
    .map(({ server, username, password, email, birth, accountId, proxy }) => ({
      full: `${server}:${username}:${password}:${email} accountId: ${accountId} date_of_birth: ${birth} proxy: ${proxy}`,
      compact: `${server}:${username}:${password}`,
    }));

  const [{ server }] = accounts;

  if (accountsToSave.length > 0) {
    const fullPath = `${dirname}/accounts/${server}_FULL_${getDate()}.txt`;
    const compactPath = `${dirname}/accounts/${server}_COMPACT_${getDate()}.txt`;
    const fullInfo = await fs.readFile(fullPath, 'utf-8').catch(() => null);
    const compactInfo = await fs.readFile(compactPath, 'utf-8').catch(() => null);
    const fullInfoToSave = [fullInfo, ...accountsToSave.map((info) => info.full)].filter(Boolean).join('\n');
    const compactInfoToSave = [compactInfo, ...accountsToSave.map((info) => info.compact)].filter(Boolean).join('\n');
    await fs.writeFile(fullPath, fullInfoToSave, 'utf-8');
    await fs.writeFile(compactPath, compactInfoToSave, 'utf-8');
  }

  const configPath = `${dirname}/${FILE_NAMES.CONFIG}`;
  const { proxyList, ...rest } = state;
  await fs.writeFile(configPath, JSON.stringify(rest), 'utf-8');
};
