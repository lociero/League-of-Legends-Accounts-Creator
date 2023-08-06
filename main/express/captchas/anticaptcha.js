/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, siteKey, url, captchaCancelToken, proxy, rqdata, userAgent }) => {
  const client = axios.create({
    cancelToken: captchaCancelToken.token,
    validateStatus: false,
  });

  const requestUrl = 'https://api.anti-captcha.com/createTask';

  const reqBody = {
    clientKey: apiKey,
    task: {
      type: 'HCaptchaTaskProxyless',
      websiteURL: url,
      websiteKey: siteKey,
      // isInvisible: true,
      // userAgent,
      enterprisePayload: {
        rqdata,
      },
    },
    softId: 942,
  };

  const task = await client.post(requestUrl, reqBody).then((res) => res.data);
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

  const { gRecaptchaResponse, userAgent: ua } = taskState.solution;
  return { token: gRecaptchaResponse, userAgent: ua };
};
