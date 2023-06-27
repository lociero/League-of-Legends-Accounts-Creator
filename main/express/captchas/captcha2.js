/* eslint-disable no-await-in-loop */
import axios from 'axios';
import querystring from 'querystring';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, siteKey, url, captchaCancelToken, userAgent, rqdata, proxy }) => {
  const client = axios.create({
    cancelToken: captchaCancelToken.token,
    validateStatus: false,
  });

  // debug =)
  // client.interceptors.response.use(
  //   (response) => {
  //     console.log('fine?', response.data);
  //     return response;
  //   },
  //   (error) => {
  //     console.log(error.response);
  //     return Promise.reject(error);
  //   }
  // );

  const queries = {
    key: apiKey,
    method: 'hcaptcha',
    sitekey: siteKey,
    pageurl: url,
    invisible: 1,
    data: rqdata,
    userAgent,
    soft_id: 2622,
  };

  if (proxy.ip) {
    queries.proxy = proxy.isAuth
      ? `${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`
      : `${proxy.ip}:${proxy.port}`;
    queries.proxytype = proxy.type;
  }

  const inQuery = querystring.stringify(queries);
  const requestUrl = `http://2captcha.com/in.php?${inQuery}`;
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
    soft_id: 2622,
  });
  const requestTokenUrl = `http://2captcha.com/res.php?${resQuery}`;
  let token = await client.get(requestTokenUrl).then((res) => res.data);

  while (token === 'CAPCHA_NOT_READY') {
    await sleep(5000);
    token = await client.get(requestTokenUrl).then((res) => res.data);
  }

  const [, result] = token.split('|');
  return { token: result ?? token, userAgent };
};
