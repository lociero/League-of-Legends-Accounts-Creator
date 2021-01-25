import { CAPTCHA_SERVICES } from '../../../constants/constants.js';
import solve2Captcha from './captcha2.js';
import solveRuCaptcha from './ruCaptcha.js';
import solveDBC from './dbc.js';
import solveAntiCaptcha from './anticaptcha.js';
import solveCapMonster from './capmonster.js';

const googleKey = '6Lc3HAsUAAAAACsN7CgY9MMVxo2M09n_e4heJEiZ';

const urls = {
  EUW: 'https://signup.euw.leagueoflegends.com/en/signup/',
  EUNE: 'https://signup.eune.leagueoflegends.com/en/signup/',
  NA: 'https://signup.na.leagueoflegends.com/en/signup/',
  BR: 'https://signup.br.leagueoflegends.com/pt/signup/index#/',
  TR: 'https://signup.tr.leagueoflegends.com/tr/signup/index',
  RU: 'https://signup.ru.leagueoflegends.com/ru/signup/index#/',
  OCE: 'https://signup.oce.leagueoflegends.com/en/signup/index/',
  LAN: 'https://signup.lan.leagueoflegends.com/en/signup/index#/',
  LAS: 'https://signup.las.leagueoflegends.com/en/signup/index#/',
  JP: 'https://signup.jp.leagueoflegends.com/ja/signup/index#/',
};

const captchaByType = {
  [CAPTCHA_SERVICES.TWOCAPTCHA]: solve2Captcha,
  [CAPTCHA_SERVICES.RUCAPTCHA]: solveRuCaptcha,
  [CAPTCHA_SERVICES.DBC]: solveDBC,
  [CAPTCHA_SERVICES.ANTICAPTCHA]: solveAntiCaptcha,
  [CAPTCHA_SERVICES.CAPMONSTER]: solveCapMonster,
};

export default (options) => captchaByType[options.type]({ ...options, url: urls[options.server], googleKey });
