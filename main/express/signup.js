import axios from 'axios';
import _ from 'lodash';
import { getAgent, random } from '../../utils/utils.js';
import { STATUS } from '../../constants/constants.js';

const errorToString = (err) => {
  if (typeof err === 'object') {
    const strings = Object.entries(err).map(([key, value]) => `${key}: ${value}`);
    return _.snakeCase(strings.join(' ')).toUpperCase() || 'UNKNOWN ERROR';
  }
  return _.snakeCase(err).toUpperCase() || 'UNKNOWN ERROR';
};

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

const register = async ({ account, token, proxy: list, cancelToken }) => {
  const currentProxy = list[random(0, list.length - 1)];
  const currentlist = list.filter(({ id }) => id !== currentProxy?.id);

  const apiUrl = 'https://signup-api.leagueoflegends.com/v1/accounts';

  const client = axios.create({
    timeout: 20000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    },
    httpsAgent: getAgent(currentProxy),
    cancelToken: cancelToken.token,
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

  const res = await client.post(apiUrl, body).catch((err) => err.response);
  if (!res) {
    return register({ account, token, proxy: currentlist, cancelToken });
  }
  if ([200, 409, 503, 429].includes(res.status)) {
    if (res.status === 409) {
      return {
        ...account,
        status: STATUS.ACCOUNT.FAILED,
        proxy: currentProxy?.ip ?? 'LOCAL',
        errors: errorToString(res.data?.fields),
      };
    }
    if ([503, 429].includes(res.status)) {
      return {
        ...account,
        status: STATUS.ACCOUNT.FAILED,
        proxy: currentProxy?.ip ?? 'LOCAL',
        errors: errorToString(res.data?.description),
      };
    }

    if (res.status === 200) {
      return {
        ...account,
        status: STATUS.ACCOUNT.SUCCESS,
        accountId: res.data.account.accountId,
        proxy: currentProxy?.ip ?? 'LOCAL',
      };
    }
  }
  return register({ account, token, proxy: currentlist, cancelToken });
};

export default register;
