const solveCaptcha = require('../captchas/index.js');
const registerAccount = require('./riotSignupApi.js');

const register = async (accountData, captchaData, proxyList, useProxy, accounts, serverState) => {
  let account = {
    ok: false,
    string: null,
    log: null,
    proxy: null,
    errors: null,
    email: { fake: true, email: null },
    token: null,
  };
  try {
    const token = await solveCaptcha(captchaData);
    account = await registerAccount(accountData, token, proxyList, useProxy);
  } catch (e) {
    serverState.errors.push(e);
  }
  accounts.list.push(account);
};

module.exports = register;
