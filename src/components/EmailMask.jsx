/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

const mapStateToProps = state => {
  const { emailMask } = state;
  return { emailMask };
};

const actionCreators = {
  updateEmail: actions.updateEmail,
};

const EmailMask = props => {
  const { emailMask } = props;

  const handleChange = e => {
    const { updateEmail } = props;
    updateEmail({ value: e.target.value });
  };

  return (
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
          value={emailMask}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default connect(mapStateToProps, actionCreators)(EmailMask);
