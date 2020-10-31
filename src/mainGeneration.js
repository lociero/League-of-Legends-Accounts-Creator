/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import axios from 'axios';
import getLink from './servers.js';
import generatePassword from './passwordGen.js';
import generateNick from './nameGen.js';
import getRandomEmailMask from './getRandomEmailMask.js';
import { getExistedEmailsList, saveEmails } from './existedEmailsList.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dataToStrings = (array) =>
  array.map((account) => {
    const errorString = Object.entries(account.errors)
      .map(([key, value]) => `| ${key}: ${value} |`)
      .join('');
    if (account.ok) {
      return `${account.proxy}${account.string} ${account.log}`;
    }
    return `${account.proxy}${account.string} ${account.log} ${errorString}`;
  });

const genAccountData = async (
  emailmask,
  isRandomEmail,
  useExistedEmails,
  realEmails,
  usernameMinLength,
  usernameMaxLength,
  passwordLength,
) => {
  const generatedUsername = generateNick(usernameMinLength, usernameMaxLength);
  const generatedPassword = generatePassword(passwordLength);
  const emailMask = isRandomEmail ? await getRandomEmailMask() : emailmask;
  const realEmail = realEmails.pop() || `${generatedUsername}@gmail.com`;
  const generatedEmail = useExistedEmails ? realEmail : `${generatedUsername}${emailMask}`;
  return {
    username: generatedUsername,
    password: generatedPassword,
    email: generatedEmail,
  };
};

const startGenerate = ({
  twoCaptchaApiKey,
  ruCaptchaApiKey,
  antiCaptchaApiKey,
  dbcUsername,
  dbcPassword,
  currCaptcha,
  amount,
  serverName,
  toggleGenerate,
  updateOutputResults,
  updateProgressBar,
  dateOfBirth,
  emailMask,
  isRandomEmail,
  useExistedEmails,
  usernameMinLength,
  usernameMaxLength,
  passwordLength,
  useProxy,
}) => async () => {
  const googleKey = '6Lc3HAsUAAAAACsN7CgY9MMVxo2M09n_e4heJEiZ';
  toggleGenerate({ phase: 'start' });
  updateProgressBar({ value: 0 });

  const realEmails = useExistedEmails ? await getExistedEmailsList() : [];
  const accountsData = Array(amount)
    .fill(null)
    .map(async () => {
      const { url, region } = getLink(serverName);
      const { username, password, email } = await genAccountData(
        emailMask,
        isRandomEmail,
        useExistedEmails,
        realEmails,
        usernameMinLength,
        usernameMaxLength,
        passwordLength,
      );
      const accountData = { username, password, email, region, birth: dateOfBirth, serverName };
      const captchaData = {
        twoCaptchaApiKey,
        ruCaptchaApiKey,
        antiCaptchaApiKey,
        dbcUsername,
        dbcPassword,
        currCaptcha,
        googleKey,
        url,
      };

      return { accountData, captchaData, useProxy };
    });
  const accsData = await Promise.all(accountsData);
  console.log('Generated Data:');
  console.log(accsData);
  await axios.post('http://localhost:5000/accounts', { accountsData: accsData });
  await sleep(1000);
  const res = await axios.get('http://localhost:5000/accounts');

  let accounts = res.data;

  while (accounts.isGenerating) {
    const res2 = await axios.get('http://localhost:5000/accounts');
    accounts = res2.data;
    const accountsString = dataToStrings(accounts.list);
    updateProgressBar({ value: (accounts.list.length / amount) * 100 });
    updateOutputResults({ value: accountsString.join('\n') });
    await sleep(1000);
  }

  accounts = accounts.list;

  const registeredUsers = accounts.filter((acc) => acc.ok);

  const info1 = `Successfully registered [${registeredUsers.length}/${amount}]`;
  const info2 = registeredUsers.length > 0 ? 'Check accounts folder!' : '';
  const resultOutput = [[info1, info2].join(' '), dataToStrings(accounts).join('\n')].join('\n');
  console.log('Finished Accounts:');
  console.log('Success:');
  console.log(accounts.filter(({ ok }) => ok));
  console.log('Error:');
  console.log(accounts.filter(({ ok }) => !ok));

  updateOutputResults({ value: resultOutput });

  if (useExistedEmails) {
    const usedEmailsWithFail = accounts
      .filter(({ ok }) => !ok)
      .filter(({ email }) => !email.fake)
      .map(({ email }) => email.email);
    await saveEmails([...realEmails, ...usedEmailsWithFail]);
  }
  toggleGenerate({ phase: 'finish' });
};

export default startGenerate;
