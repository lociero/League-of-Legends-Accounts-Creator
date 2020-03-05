import getRandomInt from './utils';

const hasNumber = string => /[A-Za-z]/.test(string);
const hasDigit = string => /\d/.test(string);

const genPass = (length = 12) => {
  const dictionary = 'QWERTYUPASDFGHJKLZXCVBNMqwertyupasdfghjkzxcvbnm23456789';
  let pass = '';
  for (let i = 0; i < length; i += 1) {
    const index = getRandomInt(0, 54);
    pass += dictionary[index];
  }
  if (hasNumber(pass) && hasDigit(pass)) {
    return pass;
  }

  return genPass(length);
};

export default genPass;
