/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { STATUS } from '../../constants/constants.js';
import { getAgent, sleep } from '../../utils/utils.js';

const check = async (proxy) => {
  const cancelToken = axios.CancelToken.source();
  sleep(30 * 1000).then(cancelToken.cancel);
  const request = axios.create({
    timeout: 10000,
    httpsAgent: getAgent(proxy),
    validateStatus: false,
    cancelToken: cancelToken.token,
  });

  const res = await request.get('https://api.ipify.org?format=json').catch((thrown) => {
    if (axios.isCancel(thrown)) {
      throw new Error(`canceled`);
    }
    return thrown.response;
  });

  if (res?.status === 200 && res?.data?.ip) {
    return { ...proxy, isWorking: STATUS.PROXY.WORKING, actualIp: `${res.data.ip}${proxy.isRotating ? '*' : ''}` };
  }
  throw new Error('ahhhhh wireeee');
};

export default async (proxy) => {
  const result = await Promise.any(
    Array(5)
      .fill()
      .map(() => check(proxy))
  ).catch(() => ({
    ...proxy,
    isWorking: STATUS.PROXY.NOT_WORKING,
  }));
  return result;
};
