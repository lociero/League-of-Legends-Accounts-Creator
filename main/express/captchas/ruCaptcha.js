/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, googleKey, url }) => {
  const balanceRes = await axios.get(`https://rucaptcha.com/res.php?key=${apiKey}&action=getbalance`);
  const balance = balanceRes.data;

  if (balance === 'ERROR_WRONG_USER_KEY') {
    return balance;
  }

  if (balance <= 0) {
    return 'ERROR_ZERO_BALANCE';
  }

  await sleep(5000);

  const requestUrl = `http://rucaptcha.com/in.php?key=${apiKey}&method=userrecaptcha&googlekey=${googleKey}&pageurl=${url}&soft_id=2694`;
  const response = await axios.post(requestUrl);

  const captchaIDres = response.data;
  if (captchaIDres === 'ERROR_WRONG_USER_KEY') {
    return captchaIDres;
  }
  const captchaID = captchaIDres.split('|')[1]; // remove 'OK|'

  await sleep(5000);

  const requestTokenUrl = `http://rucaptcha.com/res.php?key=${apiKey}&action=get&id=${captchaID}&soft_id=2694`;
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
