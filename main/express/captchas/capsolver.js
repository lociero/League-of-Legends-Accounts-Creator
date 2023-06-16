/* eslint-disable no-await-in-loop */
import axios from 'axios';
import https from 'https';
import { sleep } from '../../../utils/utils.js';

export default async ({ apiKey, siteKey, url, captchaCancelToken, rqdata, userAgent, proxy }) => {
  const client = axios.create({
    cancelToken: captchaCancelToken.token,
    validateStatus: false,
    // weird thing
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  const requestUrl = 'https://api.capsolver.com/createTask';
  const reqBody = {
    clientKey: apiKey,
    task: {
      websiteURL: url,
      websiteKey: siteKey,
      isInvisible: true,
      enterprisePayload: {
        rqdata,
        data: rqdata,
      },
      userAgent,
    },
    appId: '0C32E629-157E-4073-9045-98936BAA6500',
  };

  if (proxy.ip) {
    reqBody.task.type = 'HCaptchaEnterpriseTask';
    reqBody.task.proxy = proxy.isAuth
      ? `${proxy.type.toLowerCase()}:${proxy.ip}:${proxy.port}:${proxy.username}:${proxy.password}`
      : `${proxy.type.toLowerCase()}:${proxy.ip}:${proxy.port}`;
  } else {
    reqBody.task.type = 'HCaptchaEnterpriseTaskProxyLess';
  }

  const task = await client.post(requestUrl, reqBody).then((res) => res.data);
  const { taskId } = task;

  if (task.errorId > 0) {
    throw new Error(task.errorCode);
  }

  await sleep(5000);

  const requestTokenUrl = 'https://api.capsolver.com/getTaskResult';
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
