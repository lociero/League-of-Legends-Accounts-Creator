const SocksProxyAgent = require('socks-proxy-agent');
const axios = require('axios');

const check = async (proxy, proxyData) => {
  axios.defaults.timeout = 10000;
  const [ip] = proxy.split(':');
  const res = await axios
    .get('https://api64.ipify.org', {
      httpsAgent: new SocksProxyAgent(`socks5://${proxy}`),
    })
    .catch(() => ({ data: '' }));
  const { data } = res;
  const result = { ok: ip === data, proxy };
  if (result.ok) {
    proxyData.list.push(proxy);
  }
  return result;
};

module.exports = check;
