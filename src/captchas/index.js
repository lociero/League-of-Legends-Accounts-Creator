import solve2Captcha from './captcha2.js';
import solveRuCaptcha from './ruCaptcha.js';
import solveDBC from './dbc.js';

const captchas = {
  '2Captcha': solve2Captcha,
  ruCaptcha: solveRuCaptcha,
  deathByCaptcha: solveDBC,
};

export default ({
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
