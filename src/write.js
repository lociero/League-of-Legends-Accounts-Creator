import { promises as fs } from 'fs';

const saveAccs = async (newAccounts) => {
  const accounts = await fs
    .readFile(`${__dirname}/../generatedAccounts.txt`, 'utf-8')
    .catch(() => undefined);
  if (!accounts) {
    console.log('Creating generatedAccounts.txt');
    await fs.writeFile(`${__dirname}/../generatedAccounts.txt`, newAccounts, 'utf-8');
    return;
  }
  await fs.writeFile(
    `${__dirname}/../generatedAccounts.txt`,
    `${accounts}\n${newAccounts}`,
    'utf-8',
  );
};

export default saveAccs;
