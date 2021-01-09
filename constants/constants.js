import { remote } from 'electron';
import emailMasks from './emailMasks.js';

const expressPort = remote && remote.getGlobal('expressPort');
export const LOCALHOST = `http://localhost:${expressPort}`;

export const dirname = process.env.PORTABLE_EXECUTABLE_DIR;

export const isDev = process.env.NODE_ENV === 'development';

export const EMAIL_MASKS = [...emailMasks];

export const SERVERS = {
  EUW: 'EUW',
  EUNE: 'EUNE',
  NA: 'NA',
  BR: 'BR',
  TR: 'TR',
  RU: 'RU',
  OCE: 'OCE',
  LAN: 'LAN',
  LAS: 'LAS',
  JP: 'JP',
};

export const TABS = {
  GENERAL: 'general',
  CAPTCHA: 'captcha',
  PROXY: 'proxy',
};

export const DATE_OF_BIRTH_TYPES = {
  RANDOM: 'RANDOM',
  ONE_FOR_ALL: 'ONE FOR ALL',
};

export const EMAIL_SETTINGS_TYPES = {
  RANDOM: 'RANDOM',
  ONE_FOR_ALL: 'ONE FOR ALL',
  CUSTOM: 'CUSTOM',
};

export const USERNAME_SETTINGS_TYPES = {
  RANDOM: 'RANDOM',
  CUSTOM: 'CUSTOM',
};

export const PASSWORD_SETTINGS_TYPES = {
  RANDOM: 'RANDOM',
  ONE_FOR_ALL: 'ONE FOR ALL',
};

export const CAPTCHA_SERVICES = {
  TWOCAPTCHA: '2CAPTCHA',
  RUCAPTCHA: 'RUCAPTCHA',
  DBC: 'DEATH BY CAPTCHA',
  ANTICAPTCHA: 'ANTI-CAPTCHA',
};

export const STATE_NAMES = {
  USE_PROXY: 'useProxy',
  PROXY_LIST: 'proxyList',
  SERVER_NAME: 'serverName',
  AMOUNT: 'amount',
  BIRTH: 'birth',
  BIRTH_TYPE: 'birthType',
  EMAIL_MASK: 'emailMask',
  EMAIL_SETTINGS_TYPE: 'emailSettingsType',
  USERNAME_MIN: 'usernameMin',
  USERNAME_MAX: 'usernameMax',
  USERNAME_SET_TYPE: 'usernameSetType',
  PASSWORD_LENGTH: 'passwordLength',
  PASSWORD_SET_TYPE: 'passwordSetType',
  PASSWORD_ONE_FOR_ALL: 'passwordOneForAll',
  CURRENT_CAPTCHA: 'currentCaptcha',
  API_KEY: 'apiKey',
  DBC_USERNAME: 'dbcUsername',
  DBC_PASSWORD: 'dbcPassword',
};

export const LINKS = {
  PROXIES_SOCKS4: 'https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks4&timeout=10000',
  PROXIES_SOCKS5: 'https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks5&timeout=10000',
  INFO_SOCKS4: 'https://api.proxyscrape.com/v2/?request=proxyinfo&protocol=socks4&timeout=10000&country=all',
  INFO_SOCKS5: 'https://api.proxyscrape.com/v2/?request=proxyinfo&protocol=socks5&timeout=10000&country=all',
  CAPTCHA_SIGNUP: {
    [CAPTCHA_SERVICES.TWOCAPTCHA]: 'https://2captcha.com?from=8859803',
    [CAPTCHA_SERVICES.RUCAPTCHA]: 'https://rucaptcha.com?from=9296293',
    [CAPTCHA_SERVICES.DBC]: 'https://deathbycaptcha.com',
    [CAPTCHA_SERVICES.ANTICAPTCHA]: 'http://getcaptchasolution.com/3ddik9kzvd',
  },
};

export const FILE_NAMES = {
  CONFIG: 'config.json',
  CUSTOM_EMAILS: 'custom_emails.txt',
  CUSTOM_USERNAMES: 'custom_usernames.txt',
};

export const STATUS = {
  ACCOUNT: {
    FAILED: 'FAILED',
    SUCCESS: 'SUCCESS',
    GENERATED: 'GENERATED',
    IN_PROGRESS: 'IN PROGRESS',
  },
  PROXY: {
    WORKING: 'TRUE',
    NOT_WORKING: 'FALSE',
  },
};
