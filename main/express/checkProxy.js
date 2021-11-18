import axios from 'axios';
import { STATUS } from '../../constants/constants.js';
import { getAgent, sleep } from '../../utils/utils.js';

export default async (proxy) => {
  const cancelToken = axios.CancelToken.source();
  sleep(40 * 1000).then(cancelToken.cancel);
  const request = axios.create({
    timeout: 20000,
    httpsAgent: getAgent(proxy),
    cancelToken: cancelToken.token,
  });
  try {
    let data;
    for (let attempt = 1; attempt <= 3 && !data?.ip; attempt += 1) {
      // eslint-disable-next-line no-await-in-loop
      data = await request
        .get('https://api.ipify.org?format=json')
        .then((res) => res.data)
        .catch((thrown) => {
          if (axios.isCancel(thrown)) {
            throw new Error('canceled');
          }
          return thrown.response.data;
        });
    }
    return { ...proxy, isWorking: data?.ip === proxy.ip ? STATUS.PROXY.WORKING : STATUS.PROXY.NOT_WORKING };
  } catch (e) {
    return { ...proxy, isWorking: STATUS.PROXY.NOT_WORKING };
  }
};
