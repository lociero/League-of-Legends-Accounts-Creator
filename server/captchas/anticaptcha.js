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
  const response = await axios.post(requestUrl, reqBody);
  const task = response.data;
  const { taskId } = task;

  if (task.errorId > 0) {
    return task.errorCode;
  }

  await sleep(5000);

  const requestTokenUrl = 'https://api.anti-captcha.com/getTaskResult';
  const tokenBody = {
    clientKey: antiCaptchaApiKey,
    taskId,
  };
  const res2 = await axios.post(requestTokenUrl, tokenBody);
  let taskState = res2.data;

  if (taskState.errorId > 0) {
    return taskState.errorCode;
  }

  let attempt = 1;
  while (attempt <= 60 && taskState.status !== 'ready') {
    await sleep(5000);
    attempt += 1;
    const res3 = await axios.post(requestTokenUrl, tokenBody);
    taskState = res3.data;

    if (taskState.errorId > 0) {
      return taskState.errorCode;
    }
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
