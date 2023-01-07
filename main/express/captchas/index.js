import axios from 'axios';
import { sleep } from '../../../utils/utils.js';
import { CAPTCHA_SERVICES } from '../../../constants/constants.js';
import solve2Captcha from './captcha2.js';
import solveRuCaptcha from './ruCaptcha.js';
import solveDBC from './dbc.js';
import solveAntiCaptcha from './anticaptcha.js';
import solveCapMonster from './capmonster.js';
import solveDevFakeCaptcha from './devFakeCaptcha.js';
import solveCapSolver from './capsolver.js';

// const googleKey = '6Lc3HAsUAAAAACsN7CgY9MMVxo2M09n_e4heJEiZ';
const siteKey = 'a010c060-9eb5-498c-a7b9-9204c881f9dc';

const urls = {
  EUW: 'https://signup.leagueoflegends.com/en-gb/signup/index#/',
  EUNE: 'https://signup.leagueoflegends.com/en-pl/signup/index#/',
  NA: 'https://signup.leagueoflegends.com/en-us/signup/index#/',
  BR: 'https://signup.leagueoflegends.com/pt-br/signup/index#/',
  TR: 'https://signup.leagueoflegends.com/tr-tr/signup/index#/',
  RU: 'https://signup.leagueoflegends.com/ru-ru/signup/index#/',
  OCE: 'https://signup.leagueoflegends.com/en-au/signup/index#/',
  LAN: 'https://signup.leagueoflegends.com/es-mx/signup/index#/',
  LAS: 'https://signup.leagueoflegends.com/es-ar/signup/index#/',
  JP: 'https://signup.leagueoflegends.com/ja-jp/signup/index#/',
  PH: 'https://signup.leagueoflegends.com/en-ph/signup/index#/',
  SG: 'https://signup.leagueoflegends.com/en-sg/signup/index#/',
  TH: 'https://signup.leagueoflegends.com/th-th/signup/index#/',
  TW: 'https://signup.leagueoflegends.com/zh-tw/signup/index#/',
  VN: 'https://lienminh.vnggames.com/dang-ky/#/',
};

const captchaByType = {
  [CAPTCHA_SERVICES.TWOCAPTCHA]: solve2Captcha,
  [CAPTCHA_SERVICES.RUCAPTCHA]: solveRuCaptcha,
  [CAPTCHA_SERVICES.DBC]: solveDBC,
  [CAPTCHA_SERVICES.ANTICAPTCHA]: solveAntiCaptcha,
  [CAPTCHA_SERVICES.CAPMONSTER]: solveCapMonster,
  [CAPTCHA_SERVICES.CAPSOLVER]: solveCapSolver,
  DEV_TEST: solveDevFakeCaptcha,
};

export default async (options) => {
  const captchaCancelToken = axios.CancelToken.source();
  sleep(5 * 60 * 1000).then(() => captchaCancelToken.cancel('CAPTCHA_TIMEOUT'));
  const token = await captchaByType[options.type]({
    ...options,
    url: urls[options.server],
    siteKey,
    captchaCancelToken,
  });
  return { mode: 'hcaptcha', text: token };
};
