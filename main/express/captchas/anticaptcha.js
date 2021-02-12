/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, siteKey, url }) => {
  const { balance, errorId, errorCode } = await axios
    .post('https://api.anti-captcha.com/getBalance', {
      clientKey: apiKey,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);

  if (errorId > 0) {
    throw new Error(errorCode);
  }

  if (balance <= 0) {
    throw new Error('CAPTCHA_ZERO_BALANCE');
  }

  await sleep(5000);

  const requestUrl = 'https://api.anti-captcha.com/createTask';
  const reqBody = {
    clientKey: apiKey,
    task: {
      type: 'HCaptchaTaskProxyless',
      websiteURL: url,
      websiteKey: siteKey,
    },
    softId: 942,
  };
  const task = await axios
    .post(requestUrl, reqBody)
    .then((res) => res.data)
    .catch((err) => err.response.data);
  const { taskId } = task;

  if (task.errorId > 0) {
    throw new Error(task.errorCode);
  }

  await sleep(5000);

  const requestTokenUrl = 'https://api.anti-captcha.com/getTaskResult';
  const tokenBody = {
    clientKey: apiKey,
    taskId,
  };

  let taskState = await axios.post(requestTokenUrl, tokenBody).then((res) => res.data);

  if (taskState.errorId > 0) {
    throw new Error(taskState.errorCode);
  }

  while (taskState.status !== 'ready') {
    await sleep(5000);
    taskState = await axios.post(requestTokenUrl, tokenBody).then((res) => res.data);

    if (taskState.errorId > 0) {
      throw new Error(taskState.errorCode);
    }
  }

  const token = taskState.solution.gRecaptchaResponse;
  return token;
};
