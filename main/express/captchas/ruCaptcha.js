/* eslint-disable no-await-in-loop */
import axios from 'axios';
import querystring from 'querystring';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, siteKey, url, captchaCancelToken, rqdata, userAgent }) => {
  const client = axios.create({
    cancelToken: captchaCancelToken.token,
    validateStatus: false,
  });

  const queries = {
    key: apiKey,
    method: 'hcaptcha',
    sitekey: siteKey,
    pageurl: url,
    invisible: 1,
    data: rqdata,
    userAgent,
    soft_id: 2694,
  };

  const inQuery = querystring.stringify(queries);
  const requestUrl = `http://rucaptcha.com/in.php?${inQuery}`;
  const captchaIDres = await client.post(requestUrl).then((res) => res.data);

  const captchaID = captchaIDres.split('|')[1];

  if (!captchaID) {
    throw new Error(captchaIDres);
  }

  await sleep(20000);

  const resQuery = querystring.stringify({
    key: apiKey,
    method: 'hcaptcha',
    action: 'get',
    id: captchaID,
    soft_id: 2694,
  });
  const requestTokenUrl = `http://rucaptcha.com/res.php?${resQuery}`;
  let token = await client.get(requestTokenUrl).then((res) => res.data);

  while (token === 'CAPCHA_NOT_READY') {
    await sleep(5000);
    token = await client.get(requestTokenUrl).then((res) => res.data);
  }

  const [, result] = token.split('|');
  return { token: result ?? token, userAgent };
};
