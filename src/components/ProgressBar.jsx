/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

const mapStateToProps = state => {
  const { progressBarPercentage } = state;
  return { progressBarPercentage };
};

const actionCreators = {
  updatePasswordLength: actions.updatePasswordLength,
  generatePassword: actions.generatePassword,
};

const ProgressBar = props => {
  const { progressBarPercentage } = props;

  return (
    <div className="progress" style={{ marginBottom: '1rem' }}>
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        style={{ width: `${progressBarPercentage}%` }}
      />
    </div>
  );
};

export default connect(mapStateToProps, actionCreators)(ProgressBar);
