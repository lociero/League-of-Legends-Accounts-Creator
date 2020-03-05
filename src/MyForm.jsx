import React from 'react';
import generatePassword from './passwordGen';
import generateNick from './nameGen';
import solveCaptcha from './captcha2';
import getLink from './servers';
import requestRiotSignup from './riotApi';
import saveAccs from './write';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailmask: '@gmail.com',
      amount: '10',
      accounts: '',
      apikey: '',
      server: '',
      birth: '2000-01-01',
      isGenerating: false,
      timer: 300,
      googlekey: '6Lc3HAsUAAAAACsN7CgY9MMVxo2M09n_e4heJEiZ'
    };
    this.styles = {
      link: {
        color: 'black',
        ':hover': {
          textDecoration: 'none'
        }
      }
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  genAccount = () => {
    const { emailmask } = this.state;
    const username = generateNick();
    const password = generatePassword();
    const email = `${username}${emailmask}`;
    return { username, password, email };
  };

  registerAccount = async (googlekey, apikey, url, region) => {
    const { server, birth } = this.state;
    const { username, password, email } = this.genAccount();
    const token = await solveCaptcha(apikey, googlekey, url);
    if (!token) return null;
    const res = await requestRiotSignup(
      token,
      username,
      password,
      email,
      region,
      birth
    );
    if (res.ok) {
      return `${server}:${username}:${password}:${email}`;
    }
    return null;
  };

  onSubmit = async e => {
    e.preventDefault();
    const { apikey, amount, server, isGenerating, googlekey } = this.state;
    this.myInterval = setInterval(() => {
      this.setState(({ timer }) => ({
        timer: timer - 1
      }));
    }, 1000);
    this.setState({ isGenerating: !isGenerating });
    const { url, region } = getLink(server);
    const promises = [];
    for (let i = 0; i < Number(amount); i += 1) {
      promises.push(this.registerAccount(googlekey, apikey, url, region));
    }
    const [...users] = await Promise.all(promises);
    clearInterval(this.myInterval);
    const registeredUsers = users.filter(Boolean);
    if (registeredUsers.length > 0) {
      const firstLine = `Successfully registered [${registeredUsers.length}/${amount}]`;
      const registeredPlain = registeredUsers.join('\n');
      const lastLine = "Don't forget to copy and save them!";
      await saveAccs(registeredPlain);
      const resultOutput = `${firstLine}\n${registeredPlain}\n${lastLine}`;
      this.setState({
        accounts: resultOutput,
        isGenerating: false,
        timer: 300
      });
    } else {
      this.setState({
        accounts:
          'Something went wrong!\nCaptcha not recognized correctly, or username/email match',
        isGenerating: false,
        timer: 300
      });
    }
  };

  renderForm = () => {
    const {
      emailmask,
      amount,
      accounts,
      apikey,
      server,
      birth,
      isGenerating,
      timer
    } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <h1 className="display-4" style={{ textAlign: 'center' }}>
          League of Legends Accounts Creator
        </h1>
        <hr />
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="input2captcha" className="col-form-label">
              2Captcha API Key{' '}
              <a href="https://2captcha.com?from=8859803">sign up</a>
            </label>
            <input
              type="text"
              className="form-control"
              name="apikey"
              id="input2captcha"
              placeholder="Enter your 2Captcha API Key"
              value={apikey}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="inputServer" className="col-form-label">
              Server
            </label>
            <select
              id="inputServer"
              name="server"
              className="form-control"
              value={server}
              onChange={this.handleChange}
            >
              <option>Choose server</option>
              <option value="EUW">EUW</option>
              <option value="EUNE">EUNE</option>
              <option value="NA">NA</option>
              <option value="BR">BR</option>
              <option value="TR">TR</option>
              <option value="RU">RU</option>
              <option value="OCE">OCE</option>
              <option value="LAN">LAN</option>
              <option value="LAS">LAS</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="inputEmail4" className="col-form-label">
              Email mask
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">{'<username>'}</span>
              </div>
              <input
                type="text"
                name="emailmask"
                className="form-control"
                id="inputEmail4"
                placeholder="@hotmail.com"
                value={emailmask}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="inputAmount4" className="col-form-label">
              Number of accounts
            </label>
            <input
              type="number"
              name="amount"
              className="form-control"
              id="inputAmount4"
              placeholder="Enter the number of accounts"
              min="1"
              value={amount}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="inputBirth4" className="col-form-label">
              Date of Birth
            </label>
            <input
              type="text"
              name="birth"
              className="form-control"
              id="inputBirth4"
              placeholder="2000-01-01"
              value={birth}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="inputAccounts" className="col-form-label">
            Generated Accounts
          </label>
          <textarea
            type="text"
            className="form-control"
            name="accounts"
            id="inputAccounts"
            placeholder="Registered accounts will be here"
            rows={5}
            value={accounts}
            onChange={this.handleChange}
            readOnly
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {!isGenerating ? (
              <button type="submit" className="btn btn-primary">
                Generate
              </button>
            ) : (
              <>
                <button className="btn btn-primary" type="button" disabled>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {' Generation...'}
                </button>
                <span>{` Waiting for captcha... ${timer} seconds`}</span>
              </>
            )}
          </div>
          <span>
            <span className="font-weight-light">by megaded</span>{' '}
            <a
              style={this.styles.link}
              href="https://github.com/lociero/League-of-Legends-Accounts-Creator"
            >
              <i className="fab fa-github"></i>
            </a>{' '}
            <a style={this.styles.link} href="https://paypal.me/lociero">
              <i className="fab fa-paypal"></i>
            </a>
            {/* <Link href="https://paypal.me/lociero">
              <i className="fab fa-paypal"></i>
            </Link> */}
          </span>
        </div>
      </form>
    );
  };

  render() {
    return this.renderForm();
  }
}
