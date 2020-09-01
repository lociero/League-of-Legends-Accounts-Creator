const Express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');

const checkProxy = require('./proxycheck.js');
const register = require('./registration/index.js');
const saveAccs = require('./write.js');

const crlf = (text) => text.replace(/\r\n|\r(?!\n)|\n/g, '\n');

const server = () => {
  const app = new Express();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

  const proxyData = { isChecking: false, list: [] };
  const accounts = { isGenerating: false, list: [] };
  const serverState = { status: 'running', errors: [] };

  app.post('/updateproxylist', async (req, res) => {
    const { list } = req.body;
    const normalized = crlf(list).trim().split('\n');
    proxyData.list = normalized;
    res.json(proxyData);
  });

  app.get('/ischecking', (req, res) => {
    res.json(proxyData);
  });

  app.post('/proxycheck', async (req, res) => {
    const promises = [];
    proxyData.list.forEach((proxy) => {
      promises.push(checkProxy(proxy, proxyData));
    });
    proxyData.list = [];
    proxyData.isChecking = true;
    res.json(proxyData);
    const checkedProxies = await Promise.all(promises);
    proxyData.list = checkedProxies.filter(({ ok }) => ok).map(({ proxy }) => proxy);
    proxyData.isChecking = false;
  });

  app.post('/accounts', async (req, res) => {
    const { accountsData } = req.body;
    const proxyList = proxyData.list;
    accounts.isGenerating = true;
    accounts.list.length = 0;
    res.json(accounts);
    await Promise.map(
      accountsData,
      ({ accountData, captchaData, useProxy }) =>
        register(accountData, captchaData, proxyList, useProxy, accounts, serverState),
      { concurrency: 45 },
    );
    accounts.isGenerating = false;
    const registered = accounts.list.filter(({ ok }) => ok);
    try {
      if (registered.length > 0) {
        await saveAccs(registered.map((acc) => acc.string).join('\n'));
      }
    } catch (e) {
      serverState.errors.push(e);
    }
  });

  app.get('/accounts', (req, res) => {
    res.json(accounts);
  });

  app.get('/serverstate', (req, res) => {
    res.json({ proxyData, accounts, serverState });
  });

  return app;
};

module.exports = server;
