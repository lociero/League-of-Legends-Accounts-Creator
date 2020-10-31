const fs = require('fs').promises;

const currDir = process.env.PORTABLE_EXECUTABLE_DIR;
const today = new Date().toLocaleString('en-US').split(',')[0].replace(/\//g, '_');

const saveAccs = async (newAccounts) => {
  const fullNew = newAccounts
    .map(
      (acc) =>
        `${acc.string} account_id: ${acc.accountId} date_of_birth: ${acc.birth} proxy: ${acc.proxy}`,
    )
    .join('\n');
  const compactNew = newAccounts.map((acc) => acc.compact).join('\n');

  await fs.mkdir(`${currDir}/accounts`).catch(() => 'dir_exists');
  const fullInfo = await fs
    .readFile(`${currDir}/accounts/full_${today}.txt`, 'utf-8')
    .catch(() => '');
  const compactInfo = await fs
    .readFile(`${currDir}/accounts/compact_${today}.txt`, 'utf-8')
    .catch(() => '');

  await fs.writeFile(
    `${currDir}/accounts/full_${today}.txt`,
    [fullInfo, fullNew].join('\n').trim(),
    'utf-8',
  );
  await fs.writeFile(
    `${currDir}/accounts/compact_${today}.txt`,
    [compactInfo, compactNew].join('\n').trim(),
    'utf-8',
  );
};

module.exports = saveAccs;
