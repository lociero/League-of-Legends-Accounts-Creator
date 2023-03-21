/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
import _ from 'lodash';
import userAgents from '../../constants/userAgents.js';
import solveCaptcha from './captchas/index.js';
import signUp from './signup.js';
import { STATUS } from '../../constants/constants.js';
import getConfig from './getConfig.js';

const registration = async (account, captcha, proxy, userAgent) => {
  try {
    const { rqdata, cookies } = await getConfig(userAgent, proxy);

    const token = await solveCaptcha({ ...captcha, server: account.server, rqdata, userAgent, proxy });

    if (!token.text.includes('eyJ')) {
      throw new Error(token.text);
    }

    const result = await signUp({ account, token, proxy, cookies });
    return result;
  } catch (e) {
    return {
      ...account,
      status: STATUS.ACCOUNT.FAILED,
      errors: e.message,
      stack: e.stack,
    };
  }
};

export default async (account, captcha, proxies) => {
  let result;
  const proxiesn = _.shuffle(proxies);
  const userAgent = _.sample(userAgents);
  if (proxiesn.length === 0) {
    result = await registration(account, captcha, { actualIp: 'LOCAL' }, userAgent);
    return result;
  }
  for (let i = 0, tries = 1; i < proxiesn.length; i += 1, tries += 1) {
    if (tries > 5) {
      break;
    }
    const proxy = proxiesn[i];

    if (global.RATE_LIMITED_PROXIES.has(proxy.actualIp) && !proxy.isRotating) continue;

    result = await registration(account, captcha, proxy, userAgent);
    if (result.status === STATUS.ACCOUNT.SUCCESS) {
      return result;
    }
  }
  return result;
};
