import generatePassword from './passwordGen';
import generateNick from './nameGen';
import solveCaptcha from './captchas/index.js';
import requestRiotSignup from './riotApi';
import getRandomEmailMask from './getRandomEmailMask';

const genAccountData = async (
  emailmask,
  isCheckedEmail,
  usernameMinLength,
  usernameMaxLength,
  passwordLength,
) => {
  const generatedUsername = generateNick(usernameMinLength, usernameMaxLength);
  const generatedPassword = generatePassword(passwordLength);
  const emailMask = isCheckedEmail ? await getRandomEmailMask() : emailmask;
  const generatedEmail = `${generatedUsername}${emailMask}`;
  return {
    username: generatedUsername,
    password: generatedPassword,
    email: generatedEmail,
  };
};

const registerAccount = async ({
  serverName,
  dateOfBirth,
  emailMask,
  isCheckedEmail,
  googleKey,
  twoCaptchaApiKey,
  ruCaptchaApiKey,
  dbcUsername,
  dbcPassword,
  currCaptcha,
  url,
  region,
  usernameMinLength,
  usernameMaxLength,
  passwordLength,
  useProxy,
  proxyList,
}) => {
  const { username, password, email } = await genAccountData(
    emailMask,
    isCheckedEmail,
    usernameMinLength,
    usernameMaxLength,
    passwordLength,
  );
  const token = await solveCaptcha({
    twoCaptchaApiKey,
    ruCaptchaApiKey,
    dbcUsername,
    dbcPassword,
    currCaptcha,
    googleKey,
    url,
  });
  const accReqeustData = {
    token,
    username,
    password,
    email,
    region,
    dateOfBirth,
    useProxy,
    proxyList,
  };
  const res = await requestRiotSignup(accReqeustData);
  const { response, proxy } = res;
  if (response.status === 200) {
    const string = `${serverName}:${username}:${password}:${email}`;
    return { string, proxy, log: '✔️', ok: true };
  }
  const errorString = Object.entries(response.fields)
    .map(([key, value]) => `| ${key}: ${value} |`)
    .join('');
  const string = `${serverName}:${username}:${password}:${email}`;
  return { string, proxy, log: `❌ ${errorString}`, ok: false };
};

export default registerAccount;
