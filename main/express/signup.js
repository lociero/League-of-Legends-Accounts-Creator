/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
import axios from 'axios';
import _ from 'lodash';
import { getAgent, getDate, random, sleep } from '../../utils/utils.js';
import { STATUS } from '../../constants/constants.js';

const regions = {
  EUW: 'EUW1',
  EUNE: 'EUN1',
  ME: 'ME1',
  NA: 'NA1',
  BR: 'BR1',
  TR: 'TR1',
  RU: 'RU',
  OCE: 'OC1',
  LAN: 'LA1',
  LAS: 'LA2',
  JP: 'JP1',
  PH: 'PH2',
  SG: 'SG2',
  TH: 'TH2',
  TW: 'TW2',
  // VN: 'VN2',
  VN: null,
  PBE: 'PBE1',
};

const locales = {
  EUW: 'en',
  EUNE: 'en',
  ME: 'en',
  NA: 'en',
  BR: 'pt',
  TR: 'tr',
  RU: 'ru',
  OCE: 'en',
  LAN: 'es',
  LAS: 'es',
  JP: 'ja',
  PH: 'en',
  SG: 'en',
  TH: 'th',
  TW: 'zh-Hant',
  VN: 'vi',
  PBE: 'en',
};

const register = async ({ account, token, proxy, client }) => {
  const apiUrl = 'https://signup-api.leagueoflegends.com/v1/accounts';

  const { username, password, birth, email, server } = account;
  const body = {
    username,
    password,
    confirm_password: password,
    date_of_birth: birth.split('_').reverse().join('-'),
    email,
    tou_agree: true,
    newsletter: false,
    region: regions[server],
    campaign: '',
    product_id: 'league_of_legends',
    locale: locales[server],
    token: `${token.mode} ${token.text}`,
  };

  const res = await client.post(apiUrl, body).catch((thrown) => {
    if (axios.isCancel(thrown)) {
      throw new Error(thrown.message);
    }
  });

  if (!res) {
    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      proxy: proxy.actualIp,
      errors: 'SIGN_UP_API_ERROR',
    };
  }

  const rawCookies = res.headers['set-cookie'];
  const cookies = rawCookies
    ?.map((rawCookie) => {
      const cookie = rawCookie.split(';')[0];
      return `${cookie};`;
    })
    .join(' ');

  if (res.status === 200) {
    return {
      ...account,
      status: STATUS.ACCOUNT.SUCCESS,
      accountId: res.data.account.accountId,
      proxy: proxy.actualIp,
      creationDate: getDate(),
      puuid: res.data.account.sub,
    };
  }

  if (res.status === 409) {
    const error = _.snakeCase(JSON.stringify(res.data?.fields)).toUpperCase();

    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      proxy: proxy.actualIp,
      errors: error,
      token: res.data.token,
      isUsernameNotUnique: error.includes('USERNAME'),
      cookies,
    };
  }

  if (res.status === 503) {
    if (!res.data?.description) {
      return {
        ...account,
        status: STATUS.ACCOUNT.FAILED,
        proxy: proxy.actualIp,
        errors: `SIGN_UP_API_ERROR ${res.status}`,
      };
    }
    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      proxy: proxy.actualIp,
      errors: 'SIGN_UP_API_IS_DOWN',
    };
  }

  if (res.status === 429) {
    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      proxy: proxy.actualIp,
      errors: 'RATE_LIMITED',
      isRateLimited: true,
    };
  }

  if (res.status >= 400) {
    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      proxy: proxy.actualIp,
      errors: `SIGN_UP_API_ERROR ${res.status}`,
    };
  }

  return {
    ...account,
    status: STATUS.ACCOUNT.FAILED,
    proxy: proxy.actualIp,
    errors: `If you see that, send this msg to me please on discord: ${JSON.stringify({
      data: res.data,
      status: res.status,
    })}`,
  };
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

  if (result.isUsernameNotUnique) {
    global.USED_USERNAMES.add(account.username);
    const newUsername = `${account.username}${random(0, 9)}`;
    account.email = account.email.replace(account.username, newUsername);
    account.username = newUsername;
  }
  // let result = await register({ account: config.account, token: config.token, proxy, client });

  // if (result.isUsernameNotUnique) {
  //   const newUsername = `${config.account.username}${random(0, 9)}`;
  //   config.account.email = config.account.email.replace(config.account.username, newUsername);
  //   config.account.username = newUsername;
  //   config.token = { mode: 'Token', text: result.token };

  //   const newCancelToken = axios.CancelToken.source();
  //   sleep(2 * 60 * 1000).then(() => newCancelToken.cancel('SIGNUP_TIMEOUT'));
  //   const newClient = axios.create({
  //     timeout: 10000,
  //     headers: {
  //       'user-agent': token.userAgent,
  //       Cookie: result.cookies,
  //     },
  //     httpsAgent: getAgent(proxy),
  //     cancelToken: cancelToken.token,
  //     validateStatus: false,
  //   });
  //   result = await register({
  //     account: config.account,
  //     token: config.token,
  //     proxy,
  //     client: newClient,
  //   });
  // }
  if (result.isRateLimited && !proxy.isRotating) {
    global.RATE_LIMITED_PROXIES.add(proxy.actualIp);
    sleep(1000 * 60 * 5).then(() => global.RATE_LIMITED_PROXIES.delete(proxy.actualIp));
  }

  return result;
};
