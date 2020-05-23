/* eslint-disable no-await-in-loop */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const solveRecaptchaV2 = async ({ ruCaptchaApiKey, googleKey, url }) => {
  // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const requestUrl = `http://rucaptcha.com/in.php?key=${ruCaptchaApiKey}&method=userrecaptcha&googlekey=${googleKey}&pageurl=${url}&soft_id=2694`;
  const response = await fetch(/* proxyUrl + */ requestUrl, {
    method: 'POST',
  }).catch((err) => err);

  const captchaIDres = await response.text();
  const captchaID = captchaIDres.split('|')[1]; // remove 'OK|'

  const requestTokenUrl = `http://rucaptcha.com/res.php?key=${ruCaptchaApiKey}&action=get&id=${captchaID}&soft_id=2694`;
  let token = await fetch(/* proxyUrl + */ requestTokenUrl, {
    method: 'GET',
  }).catch((err) => err);
  token = await token.text();
  let attempt = 1;
  while (token === 'CAPCHA_NOT_READY' && attempt <= 60) {
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
