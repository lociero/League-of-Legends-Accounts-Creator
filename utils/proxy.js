import axios from 'axios';

import { LINKS } from '../constants/constants.js';

const getProxiesV2 = async () => {
  const metas = await axios.get(`https://api.openproxy.space/list?skip=0&ts=${Date.now()}`).then((res) => res.data);
  const info = metas.reduce(
    (acc, meta) => {
      if (meta.title.includes('SOCKS4')) {
        return { ...acc, SOCKS4: [...acc.SOCKS4, meta.code] };
      }
      if (meta.title.includes('SOCKS5')) {
        return { ...acc, SOCKS5: [...acc.SOCKS5, meta.code] };
      }
      return { ...acc, HTTP: [...acc.HTTP, meta.code] };
    },
    { SOCKS4: [], SOCKS5: [], HTTP: [] }
  );

  const availableProtocols = Object.keys(info);
  const codes = availableProtocols.reduce((acc, protocol) => ({ ...acc, [protocol]: info[protocol].shift() }), {});

  const socks4 = await axios.get(`https://api.openproxy.space/list/${codes.SOCKS4}`).then((res) => res.data.data);
  const socks5 = await axios.get(`https://api.openproxy.space/list/${codes.SOCKS5}`).then((res) => res.data.data);
  const http = await axios.get(`https://api.openproxy.space/list/${codes.HTTP}`).then((res) => res.data.data);

  const normalizeProxies = (proxy, type) => ({
    ...proxy,
    items: proxy.items.map((item) => {
      const [ip, port] = item.split(':');
      return { ip, port, country: proxy.code, type };
    }),
  });
  const socks4List = socks4
    .map((proxy) => normalizeProxies(proxy, 'SOCKS4'))
    .reduce((acc, { items }) => [...acc, ...items], []);
  const socks5List = socks5
    .map((proxy) => normalizeProxies(proxy, 'SOCKS5'))
    .reduce((acc, { items }) => [...acc, ...items], []);
  const httpList = http
    .map((proxy) => normalizeProxies(proxy, 'HTTP'))
    .reduce((acc, { items }) => [...acc, ...items], []);

  const finalList = [...socks4List, ...socks5List, ...httpList];
  const countries = [...new Set(finalList.map(({ country }) => country))];
  return { list: finalList, countries };
};

const getProxiesV1 = async (proxyCountry) => {
  const socks4 = await axios.get(`${LINKS.PROXIES_SOCKS4}&country=${proxyCountry}`).then((res) => res.data);
  const socks4List = socks4
    .split('\r\n')
    .filter(Boolean)
    .map((proxy) => `${proxy}:SOCKS4`);
  const socks5 = await axios.get(`${LINKS.PROXIES_SOCKS5}&country=${proxyCountry}`).then((res) => res.data);
  const socks5List = socks5
    .split('\r\n')
    .filter(Boolean)
    .map((proxy) => `${proxy}:SOCKS5`);
  const http = await axios.get(`${LINKS.PROXIES_HTTP}&country=${proxyCountry}`).then((res) => res.data);
  const httpList = http
    .split('\r\n')
    .filter(Boolean)
    .map((proxy) => `${proxy}:HTTP`);
  const finalList = [...socks4List, ...socks5List, ...httpList].map((proxy) => {
    const [ip, port, type] = proxy.split(':');
    return {
      ip,
      port,
      type,
      country: proxyCountry,
    };
  });

  return finalList;
};

const getAvailableCountriesV1 = async () => {
  const availableProxyCountries = await axios
    .get('https://api.proxyscrape.com/v2/?request=proxyinfo')
    .then((res) => res.data.countries);
  return availableProxyCountries;
};

class ProxyLoader {
  constructor() {
    this.list = [];
    this.countries = [];
  }

  async init() {
    const { list, countries } = await getProxiesV2().catch(() => ({ list: [], countries: [] }));
    const countriesV1 = await getAvailableCountriesV1().catch(() => []);
    this.list = [...list];
    const sortedCountries = [...countries, ...countriesV1].sort();
    this.countries = [...new Set(['ALL', ...sortedCountries])];
    return this;
  }

  async download(proxyCountry) {
    const proxiesV1 = await getProxiesV1(proxyCountry).catch(() => []);
    const proxiesV2 = this.list.filter(({ country }) => (proxyCountry === 'ALL' ? true : country === proxyCountry));
    const proxies = [...proxiesV1, ...proxiesV2];
    return proxies;
  }
}

export default ProxyLoader;
