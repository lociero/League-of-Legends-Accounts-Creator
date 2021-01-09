import Express from 'express';
import Promise from 'bluebird';
import bodyParser from 'body-parser';
import { readAndParse } from '../../utils/utils.js';
import generateData from '../dataGeneration.js';
import checkProxy from './checkProxy.js';
import getCaptchaBalance from './captchas/getBalance.js';
import registration from './registration.js';

const crlf = (text) => text.replace(/\r\n|\r(?!\n)|\n/g, '\n');

export default () => {
  const app = new Express();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    })
  );

  const proxyData = { isChecking: false, checked: [] };
  const accountsState = { isGenerating: false, list: [] };
  const serverState = { status: 'running', errors: [] };
  const generatedAccounts = { list: [] };
  const currentState = { state: {} };

  app.post('/generate', (req, res) => {
    const { state } = req.body;
    generatedAccounts.list = [];
    currentState.state = state;
    const customUsernames = readAndParse('custom_usernames.txt');
    const customEmails = readAndParse('custom_emails.txt');
    generatedAccounts.list = generateData(state, customUsernames, customEmails);
    res.json(generatedAccounts.list);
  });

  app.post('/updateproxylist', async (req, res) => {
    const { list } = req.body;
    const normalized = crlf(list).trim().split('\n');
    proxyData.list = normalized;
    res.json(proxyData);
  });

  app.post('/proxycheck', async (req, res) => {
    const list = req.body;
    proxyData.isChecking = true;
    proxyData.checked = [];
    res.json(proxyData);
    await Promise.map(
      list,
      async (item) => {
        const result = await checkProxy(item);
        proxyData.checked.push(result);
      },
      { concurrency: 1000 }
    );
    proxyData.isChecking = false;
  });

  app.get('/ischecking', (req, res) => {
    res.json(proxyData);
  });

  app.get('/test', (req, res) => {
    res.send('test');
  });

  app.post('/signup', async (req, res) => {
    const state = req.body;
    const accountsInProgress = generatedAccounts.list.map((acc) => ({ ...acc, status: 'IN PROGRESS' }));
    res.json({ isGenerating: true, list: accountsInProgress });
    accountsState.isGenerating = true;
    accountsState.list = [];
    const creationConfig = {
      accounts: accountsInProgress,
      captcha: {
        type: state.currentCaptcha,
        apiKey: state.apiKey,
        username: state.username,
        password: state.password,
      },
      proxy: {
        useProxy: state.useProxy,
        list: proxyData.checked.filter(({ isWorking }) => isWorking === 'TRUE'),
      },
    };
    const { accounts, captcha, proxy } = creationConfig;

    await Promise.map(
      accounts,
      async (account) => {
        // proxy.list = [...proxy.list, ...proxy.list, ...proxy.list, ...proxy.list];
        const result = await registration(account, captcha, proxy);
        accountsState.list.push(result);
      },
      { concurrency: 50 }
    );
    accountsState.isGenerating = false;
  });

  app.get('/signup', (req, res) => {
    res.json(accountsState);
  });

  app.post('/getbalance', async (req, res) => {
    const config = req.body;
    const balance = await getCaptchaBalance(config);
    res.json({ balance });
  });

  app.get('/serverstate', (req, res) => {
    res.json({ proxyData, accountsState, serverState });
  });

  return app;
};
