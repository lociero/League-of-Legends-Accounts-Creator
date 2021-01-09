import solveCaptcha from './captchas/index.js';
import signUp from './signup.js';
import { STATUS } from '../../constants/constants.js';

export default async (account, captcha, proxy) => {
  try {
    const token = await solveCaptcha({ ...captcha, server: account.server });
    if (!token.includes('03')) {
      return { ...account, status: STATUS.ACCOUNT.FAILED, token };
    }
    const result = await signUp({ account, token, proxy });
    return { ...result, token: `${token.slice(0, 25)}... [OK]` };
  } catch {
    return { ...account, status: STATUS.ACCOUNT.FAILED, errors: 'LOCAL_SERVER_ERROR' };
  }
};
