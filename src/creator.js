import generatePassword from 'password-generator';
import readlineSync from 'readline-sync';
import generateNick from './nameGen';
import decodingCaptha from './captcha';
import getLink from './servers';
import requestRiotSignup from './riotApi';
import saveAcc from './write';

const genAccount = () => {
  const username = generateNick();
  const password = generatePassword(10, false, /[0-9a-zA-Z]/);
  const email = `${username}@gmail.com`; // email mask
  return { username, password, email };
};

const getKeys = () => {
  let apiKey = ''; // 2captcha
  if (!apiKey) {
    apiKey = readlineSync.question('Enter your 2captcha API Key: ');
  }
  const googlekey = '6Lc3HAsUAAAAACsN7CgY9MMVxo2M09n_e4heJEiZ';
  return { googlekey, apiKey };
};

const getServerAndAmount = () => {
  console.log('Select Server:');
  console.log('[1] EUW');
  console.log('[2] EUN');
  console.log('[3] NA');
  console.log('[4] BR');
  console.log('[5] TR');
  console.log('[6] RU');
  console.log('[7] OCE');
  console.log('[8] LAN');
  console.log('[9] LAS');
  const serverNumber = readlineSync.question('Enter the number: ');
  const amount = readlineSync.question(
    'How many accounts you want to generate: ',
  );
  return { serverNumber, amount };
};

const registerAccount = async (googlekey, apiKey, url, region) => {
  const { username, password, email } = genAccount();
  const response = await decodingCaptha(googlekey, apiKey, url);
  if (!response) return null;
  const token = response.text;
  const res = await requestRiotSignup(token, username, password, email, region);
  if (res.ok) {
    return `${region}:${username}:${password}:${email}`;
  }
  return null;
};

const mainThread = async () => {
  console.log(`
Version 1.0.1 - League of Legends Accounts Creator
                             Discord: megaded#1529
                                        by MegaDed
`);
  const { googlekey, apiKey } = getKeys();
  const { serverNumber, amount } = getServerAndAmount();
  const { url, region } = getLink(serverNumber);
  const promises = [];
  for (let i = 0; i < Number(amount); i += 1) {
    promises.push(registerAccount(googlekey, apiKey, url, region));
  }
  console.log('waiting for captchas... 200 seconds limit');
  let timer = 200;
  const intervalId = setInterval(() => {
    timer -= 5;
    console.log(`waiting for captchas... ${timer} secs left`);
  }, 5000);
  const [...users] = await Promise.all(promises);
  clearInterval(intervalId);
  const registeredUsers = users.filter(Boolean);
  if (registeredUsers.length > 0) {
    console.log(
      `Successfully registered [${registeredUsers.length}/${amount}]`,
    );
    const registeredPlain = registeredUsers.join('\n');
    console.log(registeredPlain);
    console.log('Saving accs to generatedAccounts.txt');
    saveAcc(registeredPlain);
  } else {
    console.log('Something went wrong!');
  }
};

// try {
//   mainThread();
// } catch (e) {
//   console.log(`fuck this shit: ${e}`);
// }
export default mainThread;
