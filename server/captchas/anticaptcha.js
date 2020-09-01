/* eslint-disable no-await-in-loop */
const axios = require('axios');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const solveRecaptchaV2 = async ({ antiCaptchaApiKey, googleKey, url }) => {
  const requestUrl = 'https://api.anti-captcha.com/createTask';
  const reqBody = {
    clientKey: antiCaptchaApiKey,
    task: {
      type: 'NoCaptchaTaskProxyless',
      websiteURL: url,
      websiteKey: googleKey,
    },
    softId: 942,
  };
  const response = await axios.post(requestUrl, reqBody).catch((err) => err.response);

  if (response === undefined) {
    throw new Error('anticaptcha_connection_error');
  }

  const task = response.data || { taskId: 0 };
  const { taskId } = task;

  await sleep(5000);

  const requestTokenUrl = 'https://api.anti-captcha.com/getTaskResult';
  const tokenBody = {
    clientKey: antiCaptchaApiKey,
    taskId,
  };
  const res2 = await axios.post(requestTokenUrl, tokenBody).catch((err) => err.response);

  if (res2 === undefined) {
    throw new Error('anticaptcha_connection_error');
  }

  let taskState = res2.data || { status: 'error' };
  let attempt = 1;
  while (attempt <= 60 && !['ready', 'error'].includes(taskState.status)) {
    await sleep(5000);
    attempt += 1;
    const res3 = await axios.post(requestTokenUrl, tokenBody).catch((err) => err.response);

    if (res3 === undefined) {
      throw new Error('anticaptcha_connection_error');
    }

    taskState = res3.data || { status: 'error' };
  }

  const token = taskState?.solution?.gRecaptchaResponse || taskState?.errorCode;
  return token;
};

module.exports = solveRecaptchaV2;

// fast test
// solveRecaptchaV2({
//   antiCaptchaApiKey: '',
//   googleKey: '6Lc3HAsUAAAAACsN7CgY9MMVxo2M09n_e4heJEiZ',
//   url: 'https://signup.eune.leagueoflegends.com/en/signup/',
// });
