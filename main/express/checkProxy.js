import axios from 'axios';
import { STATUS } from '../../constants/constants.js';
import { getAgent, sleep } from '../../utils/utils.js';

export default async (proxy) => {
  const cancelToken = axios.CancelToken.source();
  sleep(20 * 1000).then(cancelToken.cancel);
  const request = axios.create({
    timeout: 20000,
    httpsAgent: getAgent(proxy),
    cancelToken: cancelToken.token,
  });
  try {
    const data = await request.get('https://api.ipify.org?format=json').then((res) => res.data);
    return { ...proxy, isWorking: data.ip === proxy.ip ? STATUS.PROXY.WORKING : STATUS.PROXY.NOT_WORKING };
  } catch (e) {
    return { ...proxy, isWorking: STATUS.PROXY.NOT_WORKING };
  }
};
