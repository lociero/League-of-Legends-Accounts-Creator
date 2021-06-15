import axios from 'axios';
import _ from 'lodash';
import { getAgent } from '../../utils/utils.js';
import { STATUS } from '../../constants/constants.js';

// const errorToString = (err) => {
//   if (typeof err === 'object') {
//     const strings = Object.entries(err).map(([key, value]) => `${key}: ${value}`);
//     return _.snakeCase(strings.join(' ')).toUpperCase() || 'UNKNOWN ERROR';
//   }
//   return _.snakeCase(err).toUpperCase() || 'UNKNOWN ERROR';
// };

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
    date_of_birth: birth,
    email,
    tou_agree: true,
    newsletter: false,
    region: regions[server],
    campaign: 'league_of_legends',
    locale: locales[server],
    token: `hcaptcha ${token}`,
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
    };
  }

  if (res.status === 409) {
    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      proxy: proxy.ip,
      errors: _.snakeCase(JSON.stringify(res.data?.fields)).toUpperCase(),
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
    };
  }

  if ([403, 404, 500, 502, 504].includes(res.status)) {
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

export default async ({ account, token, proxies, signUpCancelToken }) => {
  const proxiesn = _.shuffle(proxies);
  // eslint-disable-next-line no-restricted-syntax
  for (const proxy of proxiesn) {
    // eslint-disable-next-line no-await-in-loop
    const result = await register({ account, token, proxy, signUpCancelToken });
    if (result.status !== false) return result;
  }
  const result = await register({ account, token, proxy: { ip: 'LOCAL' }, signUpCancelToken });
  return result;
};
