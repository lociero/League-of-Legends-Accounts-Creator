#!/usr/bin/env node

const axios = require('axios');
const SocksProxyAgent = require('socks-proxy-agent');

const username = process.argv[process.argv.length - 7];
const password = process.argv[process.argv.length - 6];
const birth = process.argv[process.argv.length - 5];
const email = process.argv[process.argv.length - 4];
const region = process.argv[process.argv.length - 3];
const token = process.argv[process.argv.length - 2];
const proxy = process.argv[process.argv.length - 1];

const body = JSON.stringify(
  {
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
  },
  null,
  2,
);

const httpsAgent = new SocksProxyAgent(`socks5://${proxy}`);
const options = {
  proxy: false,
  headers: { 'Content-Type': 'application/json' },
  httpsAgent,
};
axios.defaults.timeout = 5000;

const apiUrl = 'https://signup-api.leagueoflegends.com/v1/accounts';

axios
  .post(apiUrl, JSON.parse(body), options)
  .then((res) => {
    const { status } = res;
    const result = { status };
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((err) => {
    const status = err?.response?.status;
    const fields = err?.response?.data?.fields;
    const result = { status, fields };
    console.log(JSON.stringify(result, null, 2));
  });
