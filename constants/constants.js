import { remote } from 'electron';
import emailMasks from './emailMasks.js';
import badWords from './badWords.json';

export const BAD_WORDS = [...badWords];

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
  PH: 'PH',
  SG: 'SG',
  TH: 'TH',
  TW: 'TW',
  VN: 'VN',
  PBE: 'PBE',
};

export const TABS = {
  GENERAL: 'general',
  CAPTCHA: 'captcha',
  PROXY: 'proxy',
  EXPORT_SETTINGS: 'export_settings',
  CHECKER: 'checker',
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
  NO_SYMBOLS: 'NO SYMBOLS',
};

export const CAPTCHA_SERVICES = {
  TWOCAPTCHA: '2CAPTCHA',
  RUCAPTCHA: 'RUCAPTCHA',
  ANTICAPTCHA: 'ANTI-CAPTCHA',
  CAPMONSTER: 'CAPMONSTER.CLOUD',
  CAPSOLVER: 'CAPSOLVER',
  DBC: 'DEATH BY CAPTCHA',
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
  CUSTOM_TEMPLATE: 'customTemplate',
  USE_COMPACT: 'useCompact',
  USE_FULL: 'useFull',
  USE_CUSTOM: 'useCustom',
};

export const LINKS = {
  LAST_RELEASE: 'https://api.github.com/repos/lociero/league-of-legends-accounts-creator/releases/latest',
  LAST_VERSION: 'https://github.com/lociero/League-of-Legends-Accounts-Creator/releases/latest',
  PROXIES_SOCKS4: 'https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks4&timeout=10000',
  PROXIES_SOCKS5: 'https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks5&timeout=10000',
  PROXIES_HTTP: 'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000',
  INFO_SOCKS4: 'https://api.proxyscrape.com/v2/?request=proxyinfo&protocol=socks4&timeout=10000&country=all',
  INFO_SOCKS5: 'https://api.proxyscrape.com/v2/?request=proxyinfo&protocol=socks5&timeout=10000&country=all',
  INFO_HTTP: 'https://api.proxyscrape.com/v2/?request=proxyinfo&protocol=http&timeout=10000&country=all',
  OPENSPACE_SOCKS4: 'https://api.openproxy.space/list/8JcaCZTOJ3',
  CAPTCHA_SIGNUP: {
    [CAPTCHA_SERVICES.TWOCAPTCHA]: 'https://2captcha.com?from=8859803',
    [CAPTCHA_SERVICES.RUCAPTCHA]: 'https://rucaptcha.com?from=9296293',
    [CAPTCHA_SERVICES.ANTICAPTCHA]: 'http://getcaptchasolution.com/3ddik9kzvd',
    [CAPTCHA_SERVICES.CAPMONSTER]: 'https://capmonster.cloud/',
    [CAPTCHA_SERVICES.CAPSOLVER]: 'https://dashboard.capsolver.com/passport/register?inviteCode=0ZyAex_d1l3H',
    [CAPTCHA_SERVICES.DBC]: 'https://deathbycaptcha.com/register?refid=1237003608',
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
  VERSION: {
    UP_TO_DATE: 'UP_TO_DATE',
    OUTDATED: 'OUTDATED',
    LOADING: 'LOADING',
    FAILED: 'FAILED',
  },
};
