const solve2Captcha = require('./captcha2.js');
const solveRuCaptcha = require('./ruCaptcha.js');
const solveDBC = require('./dbc.js');

const captchas = {
  '2Captcha': solve2Captcha,
  ruCaptcha: solveRuCaptcha,
  deathByCaptcha: solveDBC,
};

module.exports = ({
  twoCaptchaApiKey,
  ruCaptchaApiKey,
  dbcUsername,
  dbcPassword,
  currCaptcha,
  googleKey,
  url,
}) =>
  captchas[currCaptcha]({
    googleKey,
    url,
    twoCaptchaApiKey,
    ruCaptchaApiKey,
    dbcUsername,
    dbcPassword,
  });
