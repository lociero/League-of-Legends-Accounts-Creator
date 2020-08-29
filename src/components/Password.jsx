/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index.js';
import genPassword from '../passwordGen.js';

const mapStateToProps = (state) => {
  const {
    data: { passwordLength, passwordCheck },
  } = state;
  return { passwordLength, passwordCheck };
};

const actionCreators = {
  updatePasswordLength: actions.updatePasswordLength,
  generatePassword: actions.generatePassword,
};

const Password = (props) => {
  const { passwordLength, passwordCheck } = props;

  const handleChange = (e) => {
    const { updatePasswordLength } = props;
    updatePasswordLength({ value: e.target.value });
  };

  const passCheck = () => {
    const { generatePassword } = props;
    const generatedPass = genPassword(passwordLength);
    generatePassword({ value: generatedPass });
  };

  return (
    <>
      <div className="form-group col-md-2">
        <label htmlFor="inputPasswordLength" className="col-form-label">
          Password length
        </label>
        <input
          type="number"
          name="amount"
          className="form-control"
          id="inputPasswordLength"
          placeholder="Enter the password length"
          min="8"
          value={passwordLength}
          onChange={handleChange}
        />
      </div>
      <div className="form-group col-md-3">
        <label style={{ color: '#2B3E50' }} className="col-form-label">
          hehe
        </label>
        <input type="text" name="amount" className="form-control" value={passwordCheck} disabled />
      </div>
      <div className="form-group col-md-1">
        <label style={{ color: '#2B3E50' }} className="col-form-label">
          hehe
        </label>
        <button className="btn btn-secondary form-control" type="button" onClick={passCheck}>
          Check
        </button>
      </div>
    </>
  );
};

export default connect(mapStateToProps, actionCreators)(Password);
