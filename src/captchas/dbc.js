/* eslint-disable no-await-in-loop */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const solveRecaptchaV2 = async ({ dbcUsername, dbcPassword, googleKey, url }) => {
  const requestUrl = `http://api.dbcapi.me/2captcha/in.php?key=${dbcUsername}:${dbcPassword}&method=userrecaptcha&googlekey=${googleKey}&pageurl=${url}&soft_id=2622`;
  const response = await fetch(requestUrl, {
    method: 'POST',
  }).catch((err) => err);

  const captchaIDres = await response.text();
  const captchaID = captchaIDres.split('|')[1]; // remove 'OK|'

  const requestTokenUrl = `http://api.dbcapi.me/2captcha/res.php?key=${dbcUsername}:${dbcPassword}&action=get&id=${captchaID}&soft_id=2622`;
  let token = await fetch(requestTokenUrl, {
    method: 'GET',
  }).catch((err) => err);
  token = await token.text();
  let attempt = 1;
  while (token === 'OK|CAPCHA_NOT_READY' && attempt <= 60) {
    await sleep(5000);
    attempt += 1;
    token = await fetch(/* proxyUrl + */ requestTokenUrl, {
      method: 'GET',
    }).catch((err) => err);
    token = await token.text();
  }

  [, token] = token.split('|'); // remove 'OK|'
  return token;
};

export default solveRecaptchaV2;
