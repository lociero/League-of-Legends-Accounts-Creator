import generator from 'generate-password';

const hasNumber = string => /[A-Za-z]/.test(string);
const hasDigit = string => /\d/.test(string);

const genPass = (length = 10) => {
  const password = generator.generate({
    length: length,
    numbers: true
  });
  if (hasNumber(password) && hasDigit(password)) {
    return password;
  }

  return genPass(length);
};

export default genPass;
