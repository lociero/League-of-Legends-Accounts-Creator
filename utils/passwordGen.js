import generator from 'generate-password';

// const hasChar = (string) => /[A-Za-z]/.test(string);
// const hasNumber = (string) => /\d/.test(string);

const genPass = (length = 10) => {
  const password = generator.generate({
    length: length < 8 ? 8 : length,
    numbers: true,
    strict: true,
    symbols: true,
    exclude: '\\:\'"',
    excludeSimilarCharacters: true,
  });

  return password;
};

export default genPass;
