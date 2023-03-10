/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, siteKey, url, captchaCancelToken, userAgent, rqdata }) => {
  const client = axios.create({
    cancelToken: captchaCancelToken.token,
    validateStatus: false,
  });

  const requestUrl = 'https://api.capmonster.cloud/createTask';
  const reqBody = {
    clientKey: apiKey,
    task: {
      type: 'HCaptchaTask',
      websiteURL: url,
      websiteKey: siteKey,
      isInvisible: true,
      data: rqdata,
      // proxyType: proxy.type?.toLowerCase(),
      // proxyAddress: proxy.ip,
      // proxyPort: +proxy.port,
      // proxyLogin: proxy.username,
      // proxyPassword: proxy.password,
      userAgent,
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
  return { token, userAgent };
};
