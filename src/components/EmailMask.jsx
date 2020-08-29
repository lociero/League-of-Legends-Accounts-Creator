/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index.js';

const mapStateToProps = (state) => {
  const {
    data: { emailMask, isRandomEmail, useExistedEmails },
  } = state;
  return { emailMask, isRandomEmail, useExistedEmails };
};

const actionCreators = {
  updateEmail: actions.updateEmail,
  toggleEmailCheckBox: actions.toggleEmailCheckBox,
  toggleExistedEmails: actions.toggleExistedEmails,
};

const EmailMask = (props) => {
  const {
    emailMask,
    isRandomEmail,
    toggleEmailCheckBox,
    useExistedEmails,
    toggleExistedEmails,
  } = props;

  const handleChange = (e) => {
    const { updateEmail } = props;
    updateEmail({ value: e.target.value });
  };

  return (
    <div className="form-group col-md-6">
      <span className="d-flex justify-content-between">
        <label htmlFor="inputEmail" className="col-form-label">
          Email mask
        </label>
        <div className="custom-control custom-switch col-form-label">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
            checked={useExistedEmails}
            onChange={() => {
              toggleEmailCheckBox({ value: false });
              toggleExistedEmails({ value: !useExistedEmails });
            }}
          />
          <label
            className="custom-control-label"
            htmlFor="customCheck1"
            style={{ fontSize: '16px' }}
          >
            Existed emails
          </label>{' '}
          <span
            className="tooltipped tooltipped-n tooltipped-no-delay"
            aria-label="Put them into file ./existedEmails.txt"
          >
            <i className="fas fa-question-circle" />
          </span>
        </div>
        <div className="custom-control custom-switch col-form-label">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck2"
            checked={isRandomEmail}
            onChange={() => {
              toggleEmailCheckBox({ value: !isRandomEmail });
              toggleExistedEmails({ value: false });
            }}
          />
          <label
            className="custom-control-label"
            htmlFor="customCheck2"
            style={{ fontSize: '16px' }}
          >
            Random masks
          </label>{' '}
          <span
            className="tooltipped tooltipped-n tooltipped-no-delay"
            aria-label="Random for everyone. You can use your own masks. Change the file ./emailMasks.txt"
          >
            <i className="fas fa-question-circle" />
          </span>
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
          id="inputEmail"
          placeholder="@hotmail.com"
          value={emailMask}
          onChange={handleChange}
          disabled={isRandomEmail || useExistedEmails}
        />
      </div>
    </div>
  );
};

export default connect(mapStateToProps, actionCreators)(EmailMask);
