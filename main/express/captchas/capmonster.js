/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, googleKey, url }) => {
  const balanceRes = await axios.post('https://api.capmonster.cloud/getBalance', {
    clientKey: apiKey,
  });
  const { balance, errorId, errorCode } = balanceRes.data;

  if (errorId > 0) {
    return errorCode;
  }

  if (balance <= 0) {
    return 'ERROR_ZERO_BALANCE';
  }

  await sleep(5000);

  const requestUrl = 'https://api.capmonster.cloud/createTask';
  const reqBody = {
    clientKey: apiKey,
    task: {
      type: 'NoCaptchaTaskProxyless',
      websiteURL: url,
      websiteKey: googleKey,
    },
    softId: 42,
  };
  const response = await axios.post(requestUrl, reqBody);
  const task = response.data;
  const { taskId } = task;

  if (task.errorId > 0) {
    return task.errorCode;
  }

  await sleep(5000);

  const requestTokenUrl = 'https://api.capmonster.cloud/getTaskResult';
  const tokenBody = {
    clientKey: apiKey,
    taskId,
  };
  const res2 = await axios.post(requestTokenUrl, tokenBody);
  let taskState = res2.data;

  if (taskState.errorId > 0) {
    return taskState.errorCode;
  }

  while (taskState.status !== 'ready') {
    await sleep(5000);
    const res3 = await axios.post(requestTokenUrl, tokenBody);
    taskState = res3.data;

    if (taskState.errorId > 0) {
      return taskState.errorCode;
    }
  }

  const token = taskState.solution.gRecaptchaResponse;
  return token;
};
