const axios = require('axios');
const SocksProxyAgent = require('socks-proxy-agent');

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const register = async (accountData, token, proxyList = [], useProxy) => {
  axios.defaults.timeout = 10000;
  const proxy = !useProxy ? '' : proxyList[getRandomInt(0, proxyList.length - 1)];
  const { username, password, birth, email, region, serverName } = accountData;

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
    locale: 'en',
    token: `Captcha ${token}`,
  };

  const options = !proxy
    ? {}
    : {
        proxy: false,
        headers: { 'Content-Type': 'application/json' },
        httpsAgent: new SocksProxyAgent(`socks5://${proxy}`),
      };

  const apiUrl = 'https://signup-api.leagueoflegends.com/v1/accounts';

  const res = await axios.post(apiUrl, body, options).catch((err) => err.response);
  if (res === undefined) {
    return register(accountData, token, proxyList, useProxy);
  }
  if ([200, 409].includes(res.status)) {
    const errors = res.data?.fields || {};
    const account = {
      ok: res.status === 200,
      string: `${serverName}:${username}:${password}:${email}`,
      log: res.status === 200 ? '✔️' : '❌',
      proxy: proxy ? `[${proxy}] ` : '',
      errors,
      email: { fake: email.includes(username), email },
      token,
    };
    return account;
  }

  return register(accountData, token, proxyList, useProxy);
};

module.exports = register;
// register({}, []);
