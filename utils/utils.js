import { clipboard } from 'electron';
import fs from 'fs';
import SocksProxyAgent from 'socks-proxy-agent';
import HttpsProxyAgent from 'https-proxy-agent';
import { dirname } from '../constants/constants.js';

export const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const crlf = (text) => text.replace(/\r\n|\r(?!\n)|\n/g, '\n');

export const parseProxies = (text) => {
  try {
    const list = crlf(text).split('\n').filter(Boolean);
    const proxies = list.map((proxy, i) => {
      const [meta, auth] = proxy.split('@');
      const [ip, port, type] = meta.split(':');
      const [username, password] = auth.split(':');
      const country = 'N/A';
      return { id: i + 1, country, ip, port, type: type?.toUpperCase(), username, password, isAuth: !!username };
    });
    return proxies.filter(({ type }) => ['SOCKS4', 'SOCKS5', 'HTTP', 'HTTPS'].includes(type));
  } catch {
    return [];
  }
};

export const getDate = () => {
  const today = new Date();
  const dd = `${today.getDate()}`.padStart(2, '0');
  const mm = `${today.getMonth() + 1}`.padStart(2, '0');
  const yyyy = today.getFullYear();

  return `${dd}_${mm}_${yyyy}`;
};

export const getRandomBirth = () => {
  // timestamps
  // 788900400000 01.01.1995 0:00:00
  // 1041361199000 31.12.2002 23:59:59
  const date = new Date(random(788900400000, 1041361199000));
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const copyToClipboard = (text) => {
  clipboard.writeText(text, 'selection');
};

export const hasChar = (string) => /[A-Za-z]/.test(string);
export const hasNumber = (string) => /\d/.test(string);
export const validatePassword = (string) => hasChar(string) && hasNumber(string) && string.length >= 8;

export const readAndParse = (filename) => {
  try {
    const data = fs.readFileSync(`${dirname}/${filename}`, 'utf-8');
    const list = crlf(data).split('\n').filter(Boolean);
    return list;
  } catch {
    return [];
  }
};

export const getAgent = ({ type, isAuth, username, password, ...rest }) => {
  const agents = {
    SOCKS4: ({ ip, port, auth }) => new SocksProxyAgent(`socks4://${auth}${ip}:${port}`),
    SOCKS5: ({ ip, port, auth }) => new SocksProxyAgent(`socks5://${auth}${ip}:${port}`),
    HTTP: ({ ip, port, auth }) => new HttpsProxyAgent(`http://${auth}${ip}:${port}`),
    HTTPS: ({ ip, port, auth }) => new HttpsProxyAgent(`http://${auth}${ip}:${port}`),
  };

  const auth = isAuth ? `${username}:${password}@` : '';
  return agents[type]?.({ auth, ...rest });
};
