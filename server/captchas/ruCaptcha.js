/* eslint-disable no-await-in-loop */
const axios = require('axios');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const solveRecaptchaV2 = async ({ ruCaptchaApiKey, googleKey, url }) => {
  const requestUrl = `http://rucaptcha.com/in.php?key=${ruCaptchaApiKey}&method=userrecaptcha&googlekey=${googleKey}&pageurl=${url}&soft_id=2694`;
  const response = await axios.post(requestUrl).catch((err) => err.response);

  const captchaIDres = response.data || 'boom';
  const captchaID = captchaIDres.split('|')[1]; // remove 'OK|'

  await sleep(5000);

  const requestTokenUrl = `http://rucaptcha.com/res.php?key=${ruCaptchaApiKey}&action=get&id=${captchaID}&soft_id=2694`;
  let token = await axios.get(requestTokenUrl).catch((err) => err.response);
  token = token.data || 'boom';
  let attempt = 1;
  while (token === 'CAPCHA_NOT_READY' && attempt <= 60) {
    await sleep(5000);
    attempt += 1;
    token = await axios.get(requestTokenUrl).catch((err) => err.response);
    token = token.data || 'boom';
  }

  const [, result] = token.split('|'); // remove 'OK|'
  return result || token;
};

module.exports = solveRecaptchaV2;
