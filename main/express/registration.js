import solveCaptcha from './captchas/index.js';
import signUp from './signup.js';
import { STATUS } from '../../constants/constants.js';
import { sleep, random } from '../../utils/utils.js';

export default async (account, captcha, proxy) => {
  try {
    await sleep(random(5000, 10000));
    const token = await solveCaptcha({ ...captcha, server: account.server });
    if (!token.text.includes('eyJ')) {
      throw new Error(token.text);
    }

    const result = await signUp({ account, token, proxies: proxy });
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
