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
  NA: 'NA1',
  BR: 'BR1',
  TR: 'TR1',
  RU: 'RU',
  OCE: 'OC1',
  LAN: 'LA1',
  LAS: 'LA2',
  JP: 'JP1',
};

const locales = {
  EUW: 'en',
  EUNE: 'en',
  NA: 'en',
  BR: 'pt',
  TR: 'tr',
  RU: 'ru',
  OCE: 'en',
  LAN: 'en',
  LAS: 'en',
  JP: 'ja',
};

const register = async ({ account, token, proxy, signUpCancelToken }) => {
  const apiUrl = 'https://signup-api.leagueoflegends.com/v1/accounts';

  const client = axios.create({
    timeout: 20000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36',
    },
    httpsAgent: getAgent(proxy),
    cancelToken: signUpCancelToken.token,
    validateStatus: false,
  });

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
    campaign: 'league_of_legends',
    locale: locales[server],
    token: `${token.mode} ${token.text}`,
  };

  const res = await client.post(apiUrl, body).catch((thrown) => {
    if (axios.isCancel(thrown)) {
      throw new Error(thrown.message);
    }
  });

  if (!res) return { status: false };

  if (res.status === 200) {
    return {
      ...account,
      status: STATUS.ACCOUNT.SUCCESS,
      accountId: res.data.account.accountId,
      proxy: proxy.ip,
      creationDate: getDate(),
    };
  }

  if (res.status === 409) {
    const error = _.snakeCase(JSON.stringify(res.data?.fields)).toUpperCase();

    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      proxy: proxy.ip,
      errors: error,
      token: res.data.token,
      isUsernameNotUnique: error.includes('USERNAME'),
    };
  }

  if (res.status === 503) {
    if (!res.data?.description) {
      return { status: false };
    }
    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      proxy: proxy.ip,
      errors: 'SIGN_UP_API_IS_DOWN',
    };
  }

  if (res.status === 429) {
    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      proxy: proxy.ip,
      errors: 'RATE_LIMITED',
      isRateLimited: true,
    };
  }

  if (res.status >= 400) {
    return { status: false };
  }

  return {
    ...account,
    status: STATUS.ACCOUNT.FAILED,
    proxy: proxy.ip,
    errors: `If you see that, send this msg to me please on discord: ${JSON.stringify({
      data: res.data,
      status: res.status,
    })}`,
  };
};

export default async ({ account, token, proxies }) => {
  const signUpCancelToken = axios.CancelToken.source();
  // captcha token is only viable for 120 seconds
  sleep(2.5 * 60 * 1000).then(() => signUpCancelToken.cancel('SIGN_UP_TIMEOUT'));

  const proxiesn = _.shuffle(proxies);
  const config = {
    token,
    account,
  };
  for (let i = 0; i < proxiesn.length; i += 1) {
    const proxy = proxiesn[i];

    if (global.RATE_LIMITED_PROXIES.has(proxy.ip)) continue;

    const result = await register({ account: config.account, token: config.token, proxy, signUpCancelToken });

    if (result.isUsernameNotUnique) {
      const newUsername = `${config.account.username}${random(0, 9)}`;
      config.account.email = config.account.email.replace(config.account.username, newUsername);
      config.account.username = newUsername;
      config.token = { mode: 'Token', text: result.token };
      i -= 1;
      continue;
    }
    if (result.isRateLimited) global.RATE_LIMITED_PROXIES.add(proxy.ip);
    if (result.status) return result;
  }
  const result = await register({
    account: config.account,
    token: config.token,
    proxy: { ip: 'LOCAL' },
    signUpCancelToken,
  });
  return result;
};
