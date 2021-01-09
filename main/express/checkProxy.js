import axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { STATUS } from '../../constants/constants.js';

const agents = {
  SOCKS4: ({ ip, port }) => new SocksProxyAgent(`socks4://${ip}:${port}`),
  SOCKS5: ({ ip, port }) => new SocksProxyAgent(`socks5://${ip}:${port}`),
};

export default async (proxy) => {
  const { type } = proxy;
  const request = axios.create({
    timeout: 10000,
    httpsAgent: agents[type](proxy),
  });
  try {
    const data = await request.get('https://api.ipify.org?format=json').then((res) => res.data);
    return { ...proxy, isWorking: data.ip === proxy.ip ? STATUS.PROXY.WORKING : STATUS.PROXY.NOT_WORKING };
  } catch (e) {
    return { ...proxy, isWorking: STATUS.PROXY.NOT_WORKING };
  }
};
