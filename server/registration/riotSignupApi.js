const axios = require('axios');
const SocksProxyAgent = require('socks-proxy-agent');

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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

const register = async (accountData, token, proxyList = [], useProxy) => {
  axios.defaults.timeout = 10000;
  const proxy = !useProxy ? '' : proxyList[getRandomInt(0, proxyList.length - 1)];
  const newProxyList = proxyList.filter((e) => e !== proxy);
  const { username, password, birth, email, region, serverName } = accountData;
  const apiUrl = 'https://signup-api.leagueoflegends.com/v1/accounts';

  const body = {
    username,
    password,
    confirm_password: password,
    date_of_birth: birth,
    email,
    tou_agree: true,
    newsletter: false,
    region,
    campaign: 'league_of_legends',
    locale: locales[serverName],
    token: `Captcha ${token}`,
  };

  const cookiesOptions = !proxy
    ? {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
        },
      }
    : {
        proxy: false,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
        },
        httpsAgent: new SocksProxyAgent(`socks4://${proxy}`),
      };

  const cookiesRes = await axios.options(apiUrl, cookiesOptions).catch((err) => err.response);
  if (cookiesRes === undefined) {
    return register(accountData, token, newProxyList, useProxy);
  }
  const cookies = cookiesRes.headers['set-cookie'];

  const options = !proxy
    ? {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
          Cookies: cookies,
        },
      }
    : {
        proxy: false,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
          Cookies: cookies,
        },
        httpsAgent: new SocksProxyAgent(`socks4://${proxy}`),
      };

  const res = await axios.post(apiUrl, body, options).catch((err) => err.response);
  if (res === undefined) {
    return register(accountData, token, newProxyList, useProxy);
  }
  if ([200, 409, 503, 429].includes(res.status)) {
    let errors = { captchaToken: token.includes('03') ? 'ok' : token };
    if (res.status === 409) {
      errors = { ...res.data?.fields, ...errors };
    } else if ([503, 429].includes(res.status)) {
      errors = { '>': res.data?.description, ...errors };
    }

    const account = {
      ok: res.status === 200,
      string: `${serverName}:${username}:${password}:${email}`,
      compact: `${serverName}:${username}:${password}`,
      log: res.status === 200 ? '✔️' : '❌',
      proxy: proxy ? `[${proxy}] ` : '[local_ip]',
      errors,
      email: { fake: email.includes(username), email },
      token,
      accountId: res.status === 200 ? res.data.account.accountId : null,
      birth,
    };
    return account;
  }

  return register(accountData, token, newProxyList, useProxy);
};

module.exports = register;
// register({}, []);
