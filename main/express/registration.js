import solveCaptcha from './captchas/index.js';
import signUp from './signup.js';

export default async (account, captcha, proxy) => {
  try {
    const token = await solveCaptcha({ ...captcha, server: account.server });
    if (!token.includes('03')) {
      return { ...account, status: 'FAILED', token };
    }
    const result = await signUp({ account, token, proxy });
    return { ...result, token: `${token.slice(0, 25)}... [OK]` };
  } catch {
    return { ...account, status: 'FAILED', errors: 'LOCAL_SERVER_ERROR' };
  }
};
