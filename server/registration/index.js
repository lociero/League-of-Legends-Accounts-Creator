const solveCaptcha = require('../captchas/index.js');
const registerAccount = require('./riotSignupApi.js');

const register = async (accountData, captchaData, proxyList, useProxy, accounts, serverState) => {
  const { serverName, username, password, email } = accountData;
  let account = {
    ok: false,
    string: `${serverName}:${username}:${password}:${email}`,
    log: '❌',
    proxy: '',
    errors: { localserver: 'error' },
    email: { fake: true, email },
    token: null,
  };
  try {
    const token = await solveCaptcha(captchaData);
    account = await registerAccount(accountData, token, proxyList, useProxy);
  } catch (e) {
    serverState.errors.push({ string: e.toString(), stack: e.stack });
  }
  accounts.list.push(account);
};

module.exports = register;
