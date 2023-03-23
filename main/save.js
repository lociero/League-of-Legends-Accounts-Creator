import { promises as fs } from 'fs';
import { readAndParse, getDate, parseTemplate } from '../utils/utils.js';
import { dirname, FILE_NAMES, STATUS } from '../constants/constants.js';

export default async (accounts, state, usedUsernames) => {
  const configPath = `${dirname}/${FILE_NAMES.CONFIG}`;
  const { proxyList, ...configToSave } = state;
  await fs.writeFile(configPath, JSON.stringify(configToSave, null, 2), 'utf-8').catch(() => null);

  const successAccounts = accounts.filter(({ status }) => status === STATUS.ACCOUNT.SUCCESS);

  const emailsList = readAndParse(FILE_NAMES.CUSTOM_EMAILS);
  const successEmails = successAccounts.map(({ email }) => email);
  const emailsToSave = emailsList.filter((email) => !successEmails.includes(email));

  await fs.writeFile(`${dirname}/${FILE_NAMES.CUSTOM_EMAILS}`, emailsToSave.join('\n'), 'utf-8').catch(() => null);

  const usernamesList = readAndParse(FILE_NAMES.CUSTOM_USERNAMES);
  const successUsernames = successAccounts.map(({ username }) => username);
  const usernamesToSave = usernamesList.filter(
    (username) => !successUsernames.includes(username) && !usedUsernames.has(username)
  );

  await fs
    .writeFile(`${dirname}/${FILE_NAMES.CUSTOM_USERNAMES}`, usernamesToSave.join('\n'), 'utf-8')
    .catch(() => null);

  if (successAccounts.length < 1) {
    return;
  }

  const accountsToSave = successAccounts.map((accountInfo) => ({
    full: parseTemplate({ type: 'full' }, accountInfo),
    compact: parseTemplate({ type: 'compact' }, accountInfo),
    custom: parseTemplate({ template: state.customTemplate }, accountInfo),
  }));

  const [{ server }] = accounts;

  const fullPath = `${dirname}/accounts/${server}_FULL_${getDate()}.txt`;
  const compactPath = `${dirname}/accounts/${server}_COMPACT_${getDate()}.txt`;
  const customPath = `${dirname}/accounts/${server}_CUSTOM_${getDate()}.txt`;
  const fullInfo = await fs.readFile(fullPath, 'utf-8').catch(() => null);
  const compactInfo = await fs.readFile(compactPath, 'utf-8').catch(() => null);
  const customInfo = await fs.readFile(customPath, 'utf-8').catch(() => null);
  const fullInfoToSave = [fullInfo, ...accountsToSave.map((info) => info.full)].filter(Boolean).join('\n');
  const compactInfoToSave = [compactInfo, ...accountsToSave.map((info) => info.compact)].filter(Boolean).join('\n');
  const customInfoToSave = [customInfo, ...accountsToSave.map((info) => info.custom)].filter(Boolean).join('\n');
  if (state.useFull) await fs.writeFile(fullPath, fullInfoToSave, 'utf-8').catch(() => null);
  if (state.useCompact) await fs.writeFile(compactPath, compactInfoToSave, 'utf-8').catch(() => null);
  if (state.useCustom) await fs.writeFile(customPath, customInfoToSave, 'utf-8').catch(() => null);
};
