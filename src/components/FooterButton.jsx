/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as actions from '../actions/index';
import startGenerate from '../mainGeneration';

const mapStateToProps = (state) => {
  const {
    data: {
      usernameMinLength,
      usernameMaxLength,
      passwordLength,
      apiKey,
      amount,
      serverName,
      emailMask,
      dateOfBirth,
      isCheckedEmail,
      useProxy,
      proxyList,
    },
    isGenerating,
    timer,
  } = state;
  return {
    usernameMinLength: Number(usernameMinLength),
    usernameMaxLength: Number(usernameMaxLength),
    passwordLength: Number(passwordLength),
    apiKey,
    amount: Number(amount),
    serverName,
    isGenerating,
    timer,
    emailMask,
    dateOfBirth,
    isCheckedEmail,
    useProxy,
    proxyList,
  };
};

const actionCreators = {
  toggleGenerate: actions.toggleGenerate,
  updateOutputResults: actions.updateOutputResults,
  tickTimer: actions.tickTimer,
  resetTimer: actions.resetTimer,
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
  const { isGenerating, timer } = props;
  const { useProxy, proxyList } = props;

  return (
    <div className="d-flex justify-content-between">
      <div>
        {!isGenerating ? (
          <button
            type="submit"
            className="btn btn-primary"
            disabled={useProxy && proxyList.length < 2}
            onClick={startGenerate(props)}
          >
            Generate
          </button>
        ) : (
          <>
            <button className="btn btn-primary" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              {' Generation...'}
            </button>
            <span>{` Waiting for captcha... ${timer} seconds`}</span>
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
