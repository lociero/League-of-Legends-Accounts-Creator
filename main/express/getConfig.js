import axios from 'axios';
import { getAgent, sleep } from '../../utils/utils.js';

export default async (userAgent, proxy) => {
  const cancelToken = axios.CancelToken.source();
  sleep(1 * 30 * 1000).then(() => cancelToken.cancel('RQDATA_REQUEST_TIMEOUT'));
  const client = axios.create({
    headers: {
      'User-Agent': userAgent,
    },
    httpsAgent: getAgent(proxy),
    cancelToken: cancelToken.token,
    validateStatus: false,
  });

  const res = await client.get('https://signup-api.leagueoflegends.com/v1/config').catch((thrown) => {
    if (axios.isCancel(thrown)) {
      throw new Error(thrown.message);
    }
    throw new Error('RQDATA_REQUEST_FAILED');
  });

  if (!res?.data?.captcha?.hcaptcha || !res?.headers?.['set-cookie']) {
    throw new Error('RQDATA_REQUEST_FAILED');
  }
  const { rqdata } = res.data.captcha.hcaptcha;
  const rawCookies = res.headers['set-cookie'];
  const cookies = rawCookies
    .map((rawCookie) => {
      const cookie = rawCookie.split(';')[0];
      return `${cookie};`;
    })
    .join(' ');

  return { rqdata, cookies };
};
