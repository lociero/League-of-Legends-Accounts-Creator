/* eslint-disable no-await-in-loop */
import axios from 'axios';
import querystring from 'querystring';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, siteKey, url }) => {
  const balance = await axios
    .get(`https://rucaptcha.com/res.php?${querystring.stringify({ key: apiKey, action: 'getbalance' })}`)
    .then((res) => res.data);

  if (balance === 'ERROR_WRONG_USER_KEY') {
    throw new Error(balance);
  }

  if (balance <= 0) {
    throw new Error('CAPTCHA_ZERO_BALANCE');
  }

  await sleep(5000);

  const inQuery = querystring.stringify({
    key: apiKey,
    method: 'hcaptcha',
    sitekey: siteKey,
    pageurl: url,
    soft_id: 2694,
  });
  const requestUrl = `http://rucaptcha.com/in.php?${inQuery}`;
  const captchaIDres = await axios.post(requestUrl).then((res) => res.data);

  const captchaID = captchaIDres.split('|')[1];

  if (!captchaID) {
    throw new Error(captchaIDres);
  }

  await sleep(5000);

  const resQuery = querystring.stringify({
    key: apiKey,
    method: 'hcaptcha',
    action: 'get',
    id: captchaID,
    soft_id: 2694,
  });
  const requestTokenUrl = `http://rucaptcha.com/res.php?${resQuery}`;
  let token = await axios.get(requestTokenUrl).then((res) => res.data);

  while (token === 'CAPCHA_NOT_READY') {
    await sleep(5000);
    token = await axios.get(requestTokenUrl).then((res) => res.data);
  }

  const [, result] = token.split('|');
  return result ?? token;
};
