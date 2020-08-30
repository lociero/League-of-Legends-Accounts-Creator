const fs = require('fs').promises;

const saveAccs = async (newAccounts) => {
  const accounts = await fs
    .readFile(`${__dirname}/../../../generatedAccounts.txt`, 'utf-8')
    .catch(() => undefined);
  if (!accounts) {
    await fs.writeFile(`${__dirname}/../../../generatedAccounts.txt`, newAccounts, 'utf-8');
    return;
  }
  await fs.writeFile(
    `${__dirname}/../../../generatedAccounts.txt`,
    `${accounts}\n${newAccounts}`,
    'utf-8',
  );
};

module.exports = saveAccs;
