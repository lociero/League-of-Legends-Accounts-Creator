/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import genUsername from '../nameGen';

const mapStateToProps = state => {
  const {
    data: { usernameCheck, usernameMinLength, usernameMaxLength },
  } = state;
  return { usernameCheck, usernameMinLength, usernameMaxLength };
};

const actionCreators = {
  updateUsernameMinLength: actions.updateUsernameMinLength,
  updateUsernameMaxLength: actions.updateUsernameMaxLength,
  generateUsername: actions.generateUsername,
};

const Username = props => {
  const { usernameCheck, usernameMinLength, usernameMaxLength } = props;

  const handleMinLengthChange = e => {
    const { updateUsernameMinLength } = props;
    updateUsernameMinLength({ value: e.target.value });
  };

  const handleMaxLengthChange = e => {
    const { updateUsernameMaxLength } = props;
    updateUsernameMaxLength({ value: e.target.value });
  };

  const usernameGen = () => {
    const { generateUsername } = props;
    const generatedUsername = genUsername(
      Number(usernameMinLength),
      Number(usernameMaxLength),
    );
    generateUsername({ value: generatedUsername });
  };

  return (
    <>
      <div className="form-group col-md-3">
        <label htmlFor="inputUsernameCheck" className="col-form-label">
          Username length
        </label>
        <input
          type="text"
          className="form-control"
          id="inputUsernameCheck"
          value={usernameCheck}
          disabled
        />
      </div>
      <div className="form-group col-md-1">
        <label htmlFor="inputMinLength" className="col-form-label">
          min
        </label>
        <input
          type="number"
          name="minlength"
          id="inputMinLength"
          min="6"
          className="form-control"
          value={usernameMinLength}
          onChange={handleMinLengthChange}
        />
      </div>
      <div className="form-group col-md-1">
        <label htmlFor="inputMaxLength" className="col-form-label">
          max
        </label>
        <input
          type="number"
          name="maxlength"
          id="inputMaxLength"
          min="6"
          className="form-control"
          value={usernameMaxLength}
          onChange={handleMaxLengthChange}
        />
      </div>
      <div className="form-group col-md-1">
        <label style={{ color: '#2B3E50' }} className="col-form-label">
          hehe
        </label>
        <button
          className="btn btn-secondary form-control"
          type="button"
          onClick={usernameGen}
        >
          Check
        </button>
      </div>
    </>
  );
};

export default connect(mapStateToProps, actionCreators)(Username);
