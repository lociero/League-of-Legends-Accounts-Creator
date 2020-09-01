/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as actions from '../actions/index.js';
import startGenerate from '../mainGeneration.js';

const mapStateToProps = (state) => {
  const {
    data: {
      usernameMinLength,
      usernameMaxLength,
      passwordLength,
      twoCaptchaApiKey,
      ruCaptchaApiKey,
      antiCaptchaApiKey,
      dbcUsername,
      dbcPassword,
      currCaptcha,
      amount,
      serverName,
      emailMask,
      dateOfBirth,
      isRandomEmail,
      useProxy,
      proxyList,
      isProxyChecking,
      useExistedEmails,
    },
    isGenerating,
  } = state;
  return {
    usernameMinLength: Number(usernameMinLength),
    usernameMaxLength: Number(usernameMaxLength),
    passwordLength: Number(passwordLength),
    twoCaptchaApiKey,
    ruCaptchaApiKey,
    antiCaptchaApiKey,
    dbcUsername,
    dbcPassword,
    currCaptcha,
    amount: Number(amount),
    serverName,
    isGenerating,
    emailMask,
    dateOfBirth,
    isRandomEmail,
    useExistedEmails,
    useProxy,
    proxyList,
    isProxyChecking,
  };
};

const actionCreators = {
  toggleGenerate: actions.toggleGenerate,
  updateOutputResults: actions.updateOutputResults,
  updateProgressBar: actions.updateProgressBar,
};

const style = {
  color: '#EBEBEB',
  ':hover': {
    textDecoration: 'none',
  },
  border: 'none',
  padding: 0,
  background: 'none',
};

const FooterButton = (props) => {
  const { isGenerating, isProxyChecking } = props;
  const { useProxy, proxyList } = props;

  return (
    <div className="d-flex justify-content-between">
      <div>
        {!isGenerating ? (
          <button
            type="submit"
            className="btn btn-outline-success"
            disabled={(useProxy && proxyList.length < 2) || isProxyChecking}
            onClick={startGenerate(props)}
          >
            Generate
          </button>
        ) : (
          <>
            <button className="btn btn-outline-success" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              {' Generation...'}
            </button>
          </>
        )}
      </div>
      <span>
        <span className="font-weight-light">by megaded</span>{' '}
        <span
          className="tooltipped tooltipped-nw tooltipped-no-delay"
          aria-label="Click to copy Discord name"
        >
          <CopyToClipboard text="megaded#1529">
            <button style={style} type="button">
              <i className="fab fa-discord" />
            </button>
          </CopyToClipboard>
        </span>{' '}
        <a style={style} href="https://github.com/lociero/League-of-Legends-Accounts-Creator">
          <i className="fab fa-github" />
        </a>{' '}
        <a style={style} href="https://paypal.me/lociero">
          <i className="fab fa-paypal" />
        </a>
      </span>
    </div>
  );
};

export default connect(mapStateToProps, actionCreators)(FooterButton);
