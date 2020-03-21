/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
// import * as actions from '../actions/index';
import * as actions from '../actions/index';
import startGenerate from '../mainGeneration';

const mapStateToProps = state => {
  const {
    apiKey,
    amount,
    serverName,
    isGenerating,
    timer,
    emailMask,
    dateOfBirth,
    isCheckedEmail,
  } = state;
  return {
    apiKey,
    amount,
    serverName,
    isGenerating,
    timer,
    emailMask,
    dateOfBirth,
    isCheckedEmail,
  };
};

const actionCreators = {
  toggleGenerate: actions.toggleGenerate,
  updateOutputResults: actions.updateOutputResults,
  tickTimer: actions.tickTimer,
  resetTimer: actions.resetTimer,
};

const style = {
  color: 'black',
  ':hover': {
    textDecoration: 'none',
  },
};

const FooterButton = props => {
  const { isGenerating, timer } = props;
  const {
    apiKey,
    amount,
    serverName,
    toggleGenerate,
    updateOutputResults,
    tickTimer,
    resetTimer,
    dateOfBirth,
    emailMask,
    isCheckedEmail,
  } = props;

  return (
    <div className="d-flex justify-content-between">
      <div>
        {!isGenerating ? (
          <button
            type="submit"
            className="btn btn-primary"
            onClick={startGenerate(
              apiKey,
              amount,
              serverName,
              toggleGenerate,
              updateOutputResults,
              tickTimer,
              resetTimer,
              dateOfBirth,
              emailMask,
              isCheckedEmail,
            )}
          >
            Generate
          </button>
        ) : (
          <>
            <button className="btn btn-primary" type="button" disabled>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
              {' Generation...'}
            </button>
            <span>{` Waiting for captcha... ${timer} seconds`}</span>
          </>
        )}
      </div>
      <span>
        <span className="font-weight-light">by megaded</span>{' '}
        <a
          style={style}
          href="https://github.com/lociero/League-of-Legends-Accounts-Creator"
        >
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
