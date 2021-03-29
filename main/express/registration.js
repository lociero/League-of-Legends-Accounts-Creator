import solveCaptcha from './captchas/index.js';
import signUp from './signup.js';
import { STATUS } from '../../constants/constants.js';

export default async (account, captcha, proxy, cancelToken) => {
  try {
    const token = await solveCaptcha({ ...captcha, server: account.server });
    if (!token.includes('eyJ')) {
      throw new Error(token);
    }
    const result = await signUp({ account, token, proxy, cancelToken });
    return result;
  } catch (e) {
    return { ...account, status: STATUS.ACCOUNT.FAILED, errors: e.message };
  }
};
