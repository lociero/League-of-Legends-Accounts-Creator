/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { sleep } from '../../../utils/utils.js';

export default async ({ username, password, googleKey, url }) => {
  const balanceRes = await axios
    .get(`http://api.dbcapi.me/2captcha/res.php?key=${username}:${password}&action=getbalance`)
    .catch((err) => err.response);

  const balance = balanceRes.data;
  if (balance <= 0) {
    return 'ERROR_WRONG_USER_KEY';
  }

  const requestUrl = `http://api.dbcapi.me/2captcha/in.php?key=${username}:${password}&method=userrecaptcha&googlekey=${googleKey}&pageurl=${url}&soft_id=2622`;
  const response = await axios.post(requestUrl).catch((err) => err.response);

  const captchaIDres = response.data;
  if (captchaIDres === 'ERROR_WRONG_USER_KEY') {
    return captchaIDres;
  }
  const captchaID = captchaIDres.split('|')[1];

  await sleep(5000);

  const requestTokenUrl = `http://api.dbcapi.me/2captcha/res.php?key=${username}:${password}&action=get&id=${captchaID}&soft_id=2622`;
  const res2 = await axios.get(requestTokenUrl).catch((err) => err.response);
  let token = res2.data;
  while (token === 'OK|CAPCHA_NOT_READY') {
    await sleep(5000);
    const res3 = await axios.get(requestTokenUrl).catch((err) => err.response);
    token = res3.data;
  }

  const [, result] = token.split('|');
  return result || token;
};
