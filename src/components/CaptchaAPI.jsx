/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

const mapStateToProps = (state) => {
  const {
    data: { twoCaptchaApiKey, ruCaptchaApiKey, dbcUsername, dbcPassword, currCaptcha },
  } = state;
  return { twoCaptchaApiKey, ruCaptchaApiKey, dbcUsername, dbcPassword, currCaptcha };
};

const actionCreators = {
  update2Captcha: actions.update2Captcha,
  updateRuCaptcha: actions.updateRuCaptcha,
  updateDbcUsername: actions.updateDbcUsername,
  updateDbcPassword: actions.updateDbcPassword,
  apiServiceUpdate: actions.apiServiceUpdate,
};

const CaptchaAPI = (props) => {
  const { twoCaptchaApiKey, ruCaptchaApiKey, dbcUsername, dbcPassword, currCaptcha } = props;

  const handleUpdate2CaptchaApiKey = (e) => {
    const { update2Captcha } = props;
    update2Captcha({ value: e.target.value });
  };

  const handleUpdateRuCaptchaApiKey = (e) => {
    const { updateRuCaptcha } = props;
    updateRuCaptcha({ value: e.target.value });
  };

  const handleUpdateDbcUsername = (e) => {
    const { updateDbcUsername } = props;
    updateDbcUsername({ value: e.target.value });
  };

  const handleUpdateDbcPassword = (e) => {
    const { updateDbcPassword } = props;
    updateDbcPassword({ value: e.target.value });
  };

  const handleRadioButtonChange = (e) => {
    const { apiServiceUpdate } = props;
    apiServiceUpdate({ value: e.target.name });
  };

  return (
    <div className="col-md-12">
      <div className="form-group col-md-6">
        <span className="custom-control custom-radio" style={{ padding: '7px 24px' }}>
          <input
            type="radio"
            id="customRadio1"
            name="2Captcha"
            className="custom-control-input"
            checked={currCaptcha === '2Captcha'}
            onChange={handleRadioButtonChange}
          />
          <label
            className="custom-control-label"
            htmlFor="customRadio1"
            style={{ fontSize: '16px' }}
          >
            2Captcha <a href="https://2captcha.com?from=8859803">sign up</a>
          </label>
        </span>
        <input
          type="text"
          className="form-control"
          name="2CaptchaApiKey"
          id="input2captcha"
          placeholder="Enter your 2Captcha API Key"
          value={twoCaptchaApiKey}
          onChange={handleUpdate2CaptchaApiKey}
        />
      </div>
      <div className="form-group col-md-6" style={{ marginTop: '-10px' }}>
        <span className="custom-control custom-radio" style={{ padding: '7px 24px' }}>
          <input
            type="radio"
            id="customRadio2"
            name="ruCaptcha"
            className="custom-control-input"
            checked={currCaptcha === 'ruCaptcha'}
            onChange={handleRadioButtonChange}
          />
          <label
            className="custom-control-label"
            htmlFor="customRadio2"
            style={{ fontSize: '16px' }}
          >
            RuCaptcha <a href="https://rucaptcha.com?from=9296293">sign up</a>
          </label>
        </span>
        <input
          type="text"
          className="form-control"
          name="ruCaptchaApiKey"
          id="inputRuCaptcha"
          placeholder="Enter your RuCaptcha API Key"
          value={ruCaptchaApiKey}
          onChange={handleUpdateRuCaptchaApiKey}
        />
      </div>
      <div className="form-group col-md-6" style={{ marginTop: '-10px' }}>
        <span className="custom-control custom-radio" style={{ padding: '7px 24px' }}>
          <input
            type="radio"
            id="customRadio3"
            name="deathByCaptcha"
            className="custom-control-input"
            checked={currCaptcha === 'deathByCaptcha'}
            onChange={handleRadioButtonChange}
          />
          <label
            className="custom-control-label"
            htmlFor="customRadio3"
            style={{ fontSize: '16px' }}
          >
            DeathByCaptcha <a href="https://deathbycaptcha.com/">sign up</a>
          </label>
        </span>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            name="deathByCaptchaUsername"
            id="inputDeathByCaptcha1"
            placeholder="username"
            value={dbcUsername}
            onChange={handleUpdateDbcUsername}
          />
          <input
            type="password"
            className="form-control"
            name="deathByCaptchaPassword"
            id="inputDeathByCaptcha2"
            placeholder="password"
            value={dbcPassword}
            onChange={handleUpdateDbcPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, actionCreators)(CaptchaAPI);
