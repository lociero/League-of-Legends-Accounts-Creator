import generator from 'generate-password';

const genPassword = () => {
  const password = generator.generate({
    length: 10,
    numbers: true,
    excludeSimilarCharacters: true
  });
  return password;
};

export default genPassword;
