/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

const mapStateToProps = state => {
  const { emailMask, isCheckedEmail } = state;
  return { emailMask, isCheckedEmail };
};

const actionCreators = {
  updateEmail: actions.updateEmail,
  toggleEmailCheckBox: actions.toggleEmailCheckBox,
};

const EmailMask = props => {
  const { emailMask, isCheckedEmail, toggleEmailCheckBox } = props;

  const handleChange = e => {
    const { updateEmail } = props;
    updateEmail({ value: e.target.value });
  };

  return (
    <div className="form-group col-md-4">
      <span className="d-flex justify-content-between">
        <label htmlFor="inputEmail4" className="col-form-label">
          Email mask
        </label>
        <div className="custom-control custom-checkbox col-form-label">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
            checked={isCheckedEmail}
            onChange={toggleEmailCheckBox}
          />
          <label className="custom-control-label" htmlFor="customCheck1">
            Random for everyone
          </label>{' '}
          <i
            className="fas fa-question-circle"
            data-toggle="tooltip"
            title="You can use your own masks. Change the file ./emailMasks.txt"
          />
        </div>
      </span>
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
          disabled={isCheckedEmail}
        />
      </div>
    </div>
  );
};

export default connect(mapStateToProps, actionCreators)(EmailMask);
