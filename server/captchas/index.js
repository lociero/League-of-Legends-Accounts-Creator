const solve2Captcha = require('./captcha2.js');
const solveRuCaptcha = require('./ruCaptcha.js');
const solveDBC = require('./dbc.js');
const solveAntiCaptcha = require('./anticaptcha.js');

const captchas = {
  '2Captcha': solve2Captcha,
  ruCaptcha: solveRuCaptcha,
  deathByCaptcha: solveDBC,
  antiCaptcha: solveAntiCaptcha,
};

module.exports = (options) => captchas[options.currCaptcha](options);
