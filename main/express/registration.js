import axios from 'axios';
import solveCaptcha from './captchas/index.js';
import signUp from './signup.js';
import { STATUS } from '../../constants/constants.js';
import { sleep } from '../../utils/utils.js';

export default async (account, captcha, proxy) => {
  try {
    const captchaCancelToken = axios.CancelToken.source();
    sleep(5 * 60 * 1000).then(() => captchaCancelToken.cancel('CAPTCHA_TIMEOUT'));
    const token = await solveCaptcha({ ...captcha, server: account.server, captchaCancelToken });
    if (!token.includes('eyJ')) {
      throw new Error(token);
    }

    const signUpCancelToken = axios.CancelToken.source();
    // captcha token is only viable for 120 seconds
    sleep(2 * 60 * 1000).then(() => signUpCancelToken.cancel('SIGN_UP_TIMEOUT'));
    const result = await signUp({ account, token, proxies: proxy, signUpCancelToken });
    return result;
  } catch (e) {
    return { ...account, status: STATUS.ACCOUNT.FAILED, errors: e.message, stack: e.stack };
  }
};
