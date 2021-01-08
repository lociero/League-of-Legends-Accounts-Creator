import { clipboard } from 'electron';
import fs from 'fs';
import { dirname } from './constants.js';
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

export const parseUsernames = (text) => crlf(text).toUpperCase().split('\n').filter(Boolean);

export const getRandomBirth = () => {
  const year = random(1985, 2005);
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
