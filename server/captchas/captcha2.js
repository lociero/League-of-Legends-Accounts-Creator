/* eslint-disable no-await-in-loop */
const axios = require('axios');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const solveRecaptchaV2 = async ({ twoCaptchaApiKey, googleKey, url }) => {
  const requestUrl = `http://2captcha.com/in.php?key=${twoCaptchaApiKey}&method=userrecaptcha&googlekey=${googleKey}&pageurl=${url}&soft_id=2622`;
  const response = await axios.post(requestUrl);

  const captchaIDres = response.data;
  if (captchaIDres === 'ERROR_WRONG_USER_KEY') {
    return captchaIDres;
  }
  const captchaID = captchaIDres.split('|')[1]; // remove 'OK|'

  await sleep(5000);

  const requestTokenUrl = `http://2captcha.com/res.php?key=${twoCaptchaApiKey}&action=get&id=${captchaID}&soft_id=2622`;
  const res2 = await axios.get(requestTokenUrl);
  let token = res2.data;
  let attempt = 1;
  while (token === 'CAPCHA_NOT_READY' && attempt <= 60) {
    await sleep(5000);
    attempt += 1;
    const res3 = await axios.get(requestTokenUrl);
    token = res3.data;
  }

  const [, result] = token.split('|'); // remove 'OK|'
  return result || token;
};

module.exports = solveRecaptchaV2;
