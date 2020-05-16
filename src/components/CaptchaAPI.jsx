/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

const mapStateToProps = (state) => {
  const {
    data: { apiKey },
  } = state;
  return { apiKey };
};

const actionCreators = {
  update2Captcha: actions.update2Captcha,
};

const CaptchaAPI = (props) => {
  const { apiKey } = props;

  const handleUpdate2CaptchaApiKey = (e) => {
    const { update2Captcha } = props;
    update2Captcha({ value: e.target.value });
  };

  return (
    <div className="form-group col-md-6">
      <label htmlFor="input2captcha" className="col-form-label">
        2Captcha API Key <a href="https://2captcha.com?from=8859803">sign up</a>
      </label>
      <input
        type="text"
        className="form-control"
        name="apikey"
        id="input2captcha"
        placeholder="Enter your 2Captcha API Key"
        value={apiKey}
        onChange={handleUpdate2CaptchaApiKey}
      />
    </div>
  );
};

export default connect(mapStateToProps, actionCreators)(CaptchaAPI);
