import {
  USERNAME_SETTINGS_TYPES,
  PASSWORD_SETTINGS_TYPES,
  EMAIL_SETTINGS_TYPES,
  EMAIL_MASKS,
  DATE_OF_BIRTH_TYPES,
} from '../constants/constants.js';
import generateUsername from '../utils/nameGen.js';
import generatePassword from '../utils/passwordGen.js';
import { random, getRandomBirth } from '../utils/utils.js';

const usernameByType = {
  [USERNAME_SETTINGS_TYPES.RANDOM]: (_, min, max) => generateUsername(min, max),
  [USERNAME_SETTINGS_TYPES.CUSTOM]: (list, min, max) => list.pop() || generateUsername(min, max),
};

const emailByType = {
  [EMAIL_SETTINGS_TYPES.RANDOM]: (_, username) => `${username}${EMAIL_MASKS[random(0, EMAIL_MASKS.length - 1)]}`,
  [EMAIL_SETTINGS_TYPES.ONE_FOR_ALL]: (_, username, mask) => `${username}${mask}`,
  [EMAIL_SETTINGS_TYPES.CUSTOM]: (list, username, mask) => list.pop() || `${username}${mask}`,
};

const passwordByType = {
  [PASSWORD_SETTINGS_TYPES.RANDOM]: (length) => generatePassword(length),
  [PASSWORD_SETTINGS_TYPES.ONE_FOR_ALL]: (_, pass) => pass,
};

const birthByType = {
  [DATE_OF_BIRTH_TYPES.RANDOM]: () => getRandomBirth(),
  [DATE_OF_BIRTH_TYPES.ONE_FOR_ALL]: (date) => date,
};

const genData = (state, usernames, emails) => {
  const config = Array(Number(state.amount))
    .fill()
    .map((_, i) => {
      const username = usernameByType[state.usernameSetType](usernames, +state.usernameMin, +state.usernameMax);
      const password = passwordByType[state.passwordSetType](+state.passwordLength, state.passwordOneForAll);
      const email = emailByType[state.emailSettingsType](emails, username, state.emailMask);
      const birth = birthByType[state.birthType](state.birth);
      const id = i + 1;
      return { id, server: state.serverName, username, password, email, birth, status: 'GENERATED' };
    });

  return config;
};

export default genData;
