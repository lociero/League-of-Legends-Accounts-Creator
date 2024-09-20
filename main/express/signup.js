/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
import axios from 'axios';
import { getAgent, getDate, sleep } from '../../utils/utils.js';
import { STATUS } from '../../constants/constants.js';

const register = async ({ account, token, proxy, client }) => {
  const { username, password, birth, email } = account;

  const body = {
    type: 'signup',
    username,
    password,
    locale: 'en_US',
    newsletter: false,
    tou_agree: true,
    email_address: email,
    birth_date: birth.split('_').reverse().join('-'),
    captcha: `${token.mode} ${token.text}`,
  };

  try {
    const apiUrl = 'https://authenticate.riotgames.com/api/v1/login';
    const res = await client.put(apiUrl, body);

    if (res.status === 200) {
      if (res.data.type === 'success') {
        return {
          ...account,
          status: STATUS.ACCOUNT.SUCCESS,
          accountId: '-',
          proxy: `${proxy.actualIp} [${res.data.country}]`,
          creationDate: getDate(),
          puuid: res.data.success.puuid,
        };
      }
      return {
        ...account,
        status: STATUS.ACCOUNT.FAILED,
        proxy: `${proxy.actualIp} [${res.data.country}]`,
        errors: res.data.error.toUpperCase(),
      };
    }

    if (res?.data?.type === 'error') {
      return {
        ...account,
        status: STATUS.ACCOUNT.FAILED,
        proxy: `${proxy.actualIp} [${res.data.country}]`,
        errors: res.data.error.toUpperCase(),
        isRateLimited: res.data.error === 'user_rate_limited',
      };
    }

    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      proxy: proxy.actualIp,
      errors: 'UNHANDLED_ERROR',
    };
  } catch (thrown) {
    if (axios.isCancel(thrown)) {
      return {
        ...account,
        status: STATUS.ACCOUNT.FAILED,
        proxy: proxy.actualIp,
        errors: thrown.message,
      };
    }
    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      proxy: proxy.actualIp,
      errors: 'UNHANDLED_ERROR',
    };
  }
};

export default async ({ account, token, proxy, cookies }) => {
  const cancelToken = axios.CancelToken.source();
  sleep(2 * 60 * 1000).then(() => cancelToken.cancel('SIGNUP_TIMEOUT'));
  const client = axios.create({
    timeout: 10000,
    headers: {
      'user-agent': token.userAgent,
      Cookie: cookies,
    },
    httpsAgent: getAgent(proxy),
    cancelToken: cancelToken.token,
    validateStatus: false,
  });

  const result = await register({ account, token, proxy, client });

  if (result.isRateLimited && !proxy.isRotating) {
    global.RATE_LIMITED_PROXIES.add(proxy.actualIp);
    sleep(1000 * 60 * 5).then(() => global.RATE_LIMITED_PROXIES.delete(proxy.actualIp));
  }

  return result;
};
