/* eslint-disable no-await-in-loop */
import axios from 'axios';
import querystring from 'querystring';
import { sleep } from '../../../utils/utils.js';

export default async ({ username, password, siteKey, url, captchaCancelToken }) => {
  const client = axios.create({
    cancelToken: captchaCancelToken.token,
    validateStatus: false,
  });

  const { balance } = await client
    .get(`http://api.dbcapi.me/api?${querystring.stringify({ username, password })}`)
    .then((res) => res.data);
  if (balance <= 0) {
    throw new Error('CAPTCHA_ZERO_BALANCE');
  }

  await sleep(5000);

  const payload = querystring.stringify({
    username,
    password,
    type: 7,
    hcaptcha_params: JSON.stringify({ sitekey: siteKey, pageurl: url }),
  });

  let status = await client.post('http://api.dbcapi.me/api/captcha', payload).then((res) => res.data);

  if (!status.is_correct) {
    throw new Error('DBC_CAPTCHA_ERROR');
  }

  await sleep(5000);

  const statusUrl = `http://api.dbcapi.me/api/captcha/${status.captcha}`;

  while (!status.text) {
    await sleep(5000);
    const res3 = await client.get(statusUrl);
    status = res3.data;
  }

  if (!status.is_correct) {
    throw new Error('DBC_CAPTCHA_ERROR');
  }

  return status.text;
};
