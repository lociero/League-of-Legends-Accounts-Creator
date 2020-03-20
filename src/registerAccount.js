import generatePassword from './passwordGen';
import generateNick from './nameGen';
import solveCaptcha from './captcha2';
import requestRiotSignup from './riotApi';

const genAccountData = (emailmask, userName = 'random') => {
  const username = userName === 'random' ? generateNick() : userName;
  const password = generatePassword();
  const email = `${username}${emailmask}`;
  return { username, password, email };
};

const registerAccount = async (
  server,
  dateOfBirth,
  emailmask,
  googlekey,
  apikey,
  url,
  region,
) => {
  const { username, password, email } = genAccountData(emailmask);
  const token = await solveCaptcha(apikey, googlekey, url);
  const res = await requestRiotSignup(
    token,
    username,
    password,
    email,
    region,
    dateOfBirth,
  );
  if (res.status === 200) {
    return `${server}:${username}:${password}:${email} success!`;
  }
  return `${server}:${username}:${password}:${email} error: ${JSON.stringify(
    res.response.data.fields,
  )}`;
};

export default registerAccount;
