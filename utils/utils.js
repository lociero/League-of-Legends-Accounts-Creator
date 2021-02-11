import { clipboard } from 'electron';
import fs from 'fs';
import axios from 'axios';
import SocksProxyAgent from 'socks-proxy-agent';
import { dirname } from '../constants/constants.js';
// import $ from 'jquery';

export const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const crlf = (text) => text.replace(/\r\n|\r(?!\n)|\n/g, '\n');

export const parseProxies = (text) => {
  const list = crlf(text).toUpperCase().split('\n').filter(Boolean);
  let id = 0;
  const proxies = list.flatMap((proxy) => {
    const [ip, port, type] = proxy.split(':');
    const country = 'NULL';
    if (type) {
      id += 1;
      return { id, country, ip, port, type };
    }
    id += 2;
    return [
      { id: id - 1, country, ip, port, type: 'SOCKS4' },
      { id, country, ip, port, type: 'SOCKS5' },
    ];
  });
  return proxies.filter(({ type }) => ['SOCKS4', 'SOCKS5'].includes(type));
};

const servers = {
  EUW: 'EUW',
  EUNE: 'EUNE',
  EUN: 'EUNE',
  NA: 'NA',
  BR: 'BR',
  TR: 'TR',
  RU: 'RU',
  OCE: 'OCE',
  OC1: 'OCE',
  LAN: 'LAN',
  LA1: 'LAN',
  LAS: 'LAS',
  LA2: 'LAS',
  JP: 'JP',
  PBE: 'PBE',
};

export const parseAccounts = (text) =>
  crlf(text)
    .split('\n')
    .filter(Boolean)
    .flatMap((combo) => {
      const [region, username, password] = combo.split(':');
      const server = servers[region.toUpperCase()];
      if (server && username && password) {
        return {
          server,
          username,
          password,
        };
      }
      return [];
    })
    .map((acc, i) => ({ id: i + 1, ...acc }));

export const parseUsernames = (text) => crlf(text).toUpperCase().split('\n').filter(Boolean);

export const getRandomBirth = () => {
  const year = random(1985, 2002);
  const month = `${random(1, 12)}`.padStart(2, '0');
  const day = `${random(1, 28)}`.padStart(2, '0');
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

const agents = {
  SOCKS4: ({ ip, port }) => new SocksProxyAgent(`socks4://${ip}:${port}`),
  SOCKS5: ({ ip, port }) => new SocksProxyAgent(`socks5://${ip}:${port}`),
};

export const createAxios = (proxy) =>
  axios.create({
    timeout: 20000,
    httpsAgent: agents[proxy?.type]?.(proxy),
  });

export const genRanHex = (size) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const getDate = () => {
  const today = new Date();
  const dd = `${today.getDate()}`.padStart(2, '0');
  const mm = `${today.getMonth() + 1}`.padStart(2, '0');
  const yyyy = today.getFullYear();

  return `${dd}_${mm}_${yyyy}`;
};

const convertTimestamp = (timestamp) => {
  if (!timestamp) {
    return 'N/A';
  }
  const date = new Date(timestamp);
  const dd = `${date.getDate()}`.padStart(2, '0');
  const mm = `${date.getMonth() + 1}`.padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}.${mm}.${yyyy}`;
};

export const normalizeAccountData = (data) => {
  const { lastGame, reason, banReason = '', bannedTime, email, emailVerified, status, summonerLevel, ...rest } = data;

  return {
    lastGame: convertTimestamp(lastGame),
    status: reason.includes('banned') ? `${banReason}[BANNED]` : status,
    bannedTime: convertTimestamp(bannedTime),
    email: emailVerified ? `${email} [verified]` : `${email} [not verified]`,
    summonerLevel: summonerLevel ?? 'FRESH',
    ...rest,
  };
};
