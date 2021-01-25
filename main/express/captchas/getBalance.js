import axios from 'axios';
import { CAPTCHA_SERVICES } from '../../../constants/constants.js';

const mapping = {
  [CAPTCHA_SERVICES.TWOCAPTCHA]: async (apiKey) => {
    const data = await axios
      .get(`https://2captcha.com/res.php?key=${apiKey}&action=getbalance&json=1`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
    return data.request;
  },
  [CAPTCHA_SERVICES.RUCAPTCHA]: async (apiKey) => {
    const data = await axios
      .get(`https://rucaptcha.com/res.php?key=${apiKey}&action=getbalance&json=1`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
    return data.request;
  },
  [CAPTCHA_SERVICES.DBC]: async (_apiKey, username, password) => {
    const data = await axios
      .get(`http://api.dbcapi.me/2captcha/res.php?key=${username}:${password}&action=getbalance`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
    return data;
  },
  [CAPTCHA_SERVICES.ANTICAPTCHA]: async (apiKey) => {
    const data = await axios
      .post('https://api.anti-captcha.com/getBalance', { clientKey: apiKey })
      .then((res) => res.data)
      .catch((err) => err.response.data);
    return data.balance ?? data.errorCode;
  },
  [CAPTCHA_SERVICES.CAPMONSTER]: async (apiKey) => {
    const data = await axios
      .post('https://api.capmonster.cloud/getBalance', { clientKey: apiKey })
      .then((res) => res.data)
      .catch((err) => err.response.data);
    return data.balance ?? data.errorCode;
  },
};

export default async ({ currentCaptcha, apiKey, username, password }) => {
  try {
    const result = await mapping[currentCaptcha](apiKey, username, password);
    return result;
  } catch (e) {
    return 'TRY AGAIN PLEASE';
  }
};
