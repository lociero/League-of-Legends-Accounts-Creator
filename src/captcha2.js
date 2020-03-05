// const fetch = require('node-fetch');
// const axios = require('axios');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const solveRecaptchaV2 = async (APIKey, googlekey, pageUrl) => {
  // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const requestUrl = `http://2captcha.com/in.php?key=${APIKey}&method=userrecaptcha&googlekey=${googlekey}&pageurl=${pageUrl}`;
  const response = await fetch(/*proxyUrl + */ requestUrl, {
    method: 'POST'
  });
  // const response = await axios.post(requestUrl);
  const captchaIDres = await response.text(); // .split('|')[1]
  const captchaID = captchaIDres.split('|')[1];

  const requestTokenUrl = `http://2captcha.com/res.php?key=${APIKey}&action=get&id=${captchaID}`;
  let token = await fetch(/*proxyUrl + */ requestTokenUrl, {
    method: 'GET'
  });
  token = await token.text();
  let attempt = 1;
  while (token === 'CAPCHA_NOT_READY' && attempt <= 60) {
    await sleep(5000);
    attempt = attempt + 1;
    token = await fetch(/*proxyUrl + */ requestTokenUrl, {
      method: 'GET'
    });
    token = await token.text();
  }

  token = token.split('|')[1];
  return token;
};

export default solveRecaptchaV2;
