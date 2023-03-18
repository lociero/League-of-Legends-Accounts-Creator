import axios from 'axios';
import querystring from 'querystring';
import https from 'https';
import { CAPTCHA_SERVICES } from '../../../constants/constants.js';

const mapping = {
  [CAPTCHA_SERVICES.TWOCAPTCHA]: async (apiKey) => {
    const query = querystring.stringify({
      key: apiKey,
      action: 'getbalance',
      json: 1,
    });
    const data = await axios
      .get(`https://2captcha.com/res.php?${query}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
    return data.request;
  },
  [CAPTCHA_SERVICES.RUCAPTCHA]: async (apiKey) => {
    const query = querystring.stringify({
      key: apiKey,
      action: 'getbalance',
      json: 1,
    });
    const data = await axios
      .get(`https://rucaptcha.com/res.php?${query}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
    return data.request;
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
  [CAPTCHA_SERVICES.CAPSOLVER]: async (apiKey) => {
    const data = await axios
      .post(
        'https://api.capsolver.com/getBalance',
        { clientKey: apiKey },
        {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        }
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
    return data.balance ?? data.errorCode;
  },
};

export default async ({ currentCaptcha, apiKey }) => {
  try {
    const result = await mapping[currentCaptcha](apiKey);
    return result;
  } catch {
    return 'TRY AGAIN PLEASE';
  }
};
