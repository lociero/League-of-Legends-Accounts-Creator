import generator from 'generate-password';

// const hasChar = (string) => /[A-Za-z]/.test(string);
// const hasNumber = (string) => /\d/.test(string);

const genPass = (length = 10) => {
  const password = generator.generate({
    length,
    numbers: true,
    strict: true,
    excludeSimilarCharacters: true,
  });

  return password;
};

export default genPass;
