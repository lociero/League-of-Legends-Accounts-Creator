/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, siteKey, url }) => {
  const balance = await axios
    .get(`https://2captcha.com/res.php?key=${apiKey}&action=getbalance`)
    .then((res) => res.data);

  if (balance === 'ERROR_WRONG_USER_KEY') {
    throw new Error(balance);
  }

  if (balance <= 0) {
    throw new Error('CAPTCHA_ZERO_BALANCE');
  }

  await sleep(5000);

  const requestUrl = `http://2captcha.com/in.php?key=${apiKey}&method=hcaptcha&sitekey=${siteKey}&pageurl=${url}&soft_id=2622`;
  const captchaIDres = await axios.post(requestUrl).then((res) => res.data);

  const captchaID = captchaIDres.split('|')[1];

  await sleep(5000);

  const requestTokenUrl = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaID}&soft_id=2622`;
  let token = await axios.get(requestTokenUrl).then((res) => res.data);

  while (token === 'CAPCHA_NOT_READY') {
    await sleep(5000);
    token = await axios.get(requestTokenUrl).then((res) => res.data);
  }

  const [, result] = token.split('|');
  return result ?? token;
};
