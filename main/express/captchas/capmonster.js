/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, siteKey, url, captchaCancelToken }) => {
  const client = axios.create({
    cancelToken: captchaCancelToken.token,
    validateStatus: false,
  });

  const { balance, errorId, errorCode } = await client
    .post('https://api.capmonster.cloud/getBalance', {
      clientKey: apiKey,
    })
    .then((res) => res.data);

  if (errorId > 0) {
    throw new Error(errorCode);
  }

  if (balance <= 0) {
    throw new Error('CAPTCHA_ZERO_BALANCE');
  }

  await sleep(5000);

  const requestUrl = 'https://api.capmonster.cloud/createTask';
  const reqBody = {
    clientKey: apiKey,
    task: {
      type: 'HCaptchaTaskProxyless',
      websiteURL: url,
      websiteKey: siteKey,
    },
    softId: 42,
  };
  const task = await client.post(requestUrl, reqBody).then((res) => res.data);
  const { taskId } = task;

  if (task.errorId > 0) {
    throw new Error(task.errorCode);
  }

  await sleep(5000);

  const requestTokenUrl = 'https://api.capmonster.cloud/getTaskResult';
  const tokenBody = {
    clientKey: apiKey,
    taskId,
  };
  let taskState = await client.post(requestTokenUrl, tokenBody).then((res) => res.data);

  if (taskState.errorId > 0) {
    throw new Error(taskState.errorCode);
  }

  while (taskState.status !== 'ready') {
    await sleep(5000);
    taskState = await client.post(requestTokenUrl, tokenBody).then((res) => res.data);

    if (taskState.errorId > 0) {
      throw new Error(taskState.errorCode);
    }
  }

  const token = taskState.solution.gRecaptchaResponse;
  return token;
};
