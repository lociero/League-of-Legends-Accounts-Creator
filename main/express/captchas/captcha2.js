/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, siteKey, url }) => {
  const balanceRes = await axios.get(`https://2captcha.com/res.php?key=${apiKey}&action=getbalance`);
  const balance = balanceRes.data;

  if (balance === 'ERROR_WRONG_USER_KEY') {
    return balance;
  }

  if (balance <= 0) {
    return 'ERROR_ZERO_BALANCE';
  }

  await sleep(5000);

  const requestUrl = `http://2captcha.com/in.php?key=${apiKey}&method=hcaptcha&sitekey=${siteKey}&pageurl=${url}&soft_id=2622`;
  const response = await axios.post(requestUrl);

  const captchaIDres = response.data;
  const captchaID = captchaIDres.split('|')[1]; // remove 'OK|'

  await sleep(5000);

  const requestTokenUrl = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaID}&soft_id=2622`;
  const res2 = await axios.get(requestTokenUrl);
  let token = res2.data;
  while (token === 'CAPCHA_NOT_READY') {
    await sleep(5000);
    const res3 = await axios.get(requestTokenUrl);
    token = res3.data;
  }

  const [, result] = token.split('|'); // remove 'OK|'
  return result || token;
};
