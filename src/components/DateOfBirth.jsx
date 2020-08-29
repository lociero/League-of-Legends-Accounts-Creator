/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index.js';

const mapStateToProps = (state) => {
  const {
    data: { dateOfBirth },
  } = state;
  return { dateOfBirth };
};

const actionCreators = {
  updateDateOfBirth: actions.updateDateOfBirth,
};

const DateOfBirth = (props) => {
  const { dateOfBirth } = props;

  const handleChange = (e) => {
    const { updateDateOfBirth } = props;
    updateDateOfBirth({ value: e.target.value });
  };

  return (
    <div className="form-group col-md-6">
      <label htmlFor="inputBirth" className="col-form-label">
        Date of Birth
      </label>
      <input
        type="text"
        name="birth"
        className="form-control"
        id="inputBirth"
        placeholder="2000-01-01"
        value={dateOfBirth}
        onChange={handleChange}
      />
    </div>
  );
};

export default connect(mapStateToProps, actionCreators)(DateOfBirth);
