/* eslint-disable no-await-in-loop */
import axios from 'axios';
import querystring from 'querystring';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, siteKey, url, captchaCancelToken }) => {
  const client = axios.create({
    cancelToken: captchaCancelToken.token,
    validateStatus: false,
  });

  const balance = await client
    .get(`https://2captcha.com/res.php?${querystring.stringify({ key: apiKey, action: 'getbalance' })}`)
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
    soft_id: 2622,
  });
  const requestUrl = `http://2captcha.com/in.php?${inQuery}`;
  const captchaIDres = await client.post(requestUrl).then((res) => res.data);

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
    soft_id: 2622,
  });
  const requestTokenUrl = `http://2captcha.com/res.php?${resQuery}`;
  let token = await client.get(requestTokenUrl).then((res) => res.data);

  while (token === 'CAPCHA_NOT_READY') {
    await sleep(5000);
    token = await client.get(requestTokenUrl).then((res) => res.data);
  }

  const [, result] = token.split('|');
  return result ?? token;
};
