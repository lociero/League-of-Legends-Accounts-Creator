import registerAccount from './registerAccount';
import getLink from './servers';
import saveAccs from './write';

const startGenerate = (
  apiKey,
  amount,
  serverName,
  toggleGenerate,
  updateOutputResults,
  updateProgressBar,
  tickTimer,
  resetTimer,
  dateOfBirth,
  emailMask,
  isCheckedEmail,
  usernameMinLength,
  usernameMaxLength,
  passwordLength,
  useProxy,
  proxyList,
) => async () => {
  const googleKey = '6Lc3HAsUAAAAACsN7CgY9MMVxo2M09n_e4heJEiZ';
  const timerInterval = setInterval(tickTimer, 1000);
  toggleGenerate({ phase: 'start' });
  const { url, region } = getLink(serverName);
  let progress = 0;
  updateProgressBar({ value: 0 });
  const requests = Array(amount)
    .fill(null)
    .map(async () => {
      const acc = await registerAccount(
        serverName,
        dateOfBirth,
        emailMask,
        isCheckedEmail,
        googleKey,
        apiKey,
        url,
        region,
        usernameMinLength,
        usernameMaxLength,
        passwordLength,
        useProxy,
        proxyList,
      );
      progress += 1;
      updateProgressBar({ value: (progress / amount) * 100 });
      return acc;
    });
  const [...users] = await Promise.all(requests);
  clearInterval(timerInterval);
  resetTimer();
  const registeredUsers = users.filter((string) => !string.includes('ERROR'));

  const info1 = `Successfully registered [${registeredUsers.length}/${amount}]`;
  const normalizedRegisteredUsers = registeredUsers.map((string) => string.slice(0, -9)).join('\n');
  const info2 = 'Check ./generatedAccounts.txt!';
  if (registeredUsers.length > 0) await saveAccs(normalizedRegisteredUsers);
  const resultOutput = `${info1}\n${users.join('\n')}\n${info2}`;
  updateOutputResults({ value: resultOutput });
  toggleGenerate({ phase: 'finish' });
};

export default startGenerate;
