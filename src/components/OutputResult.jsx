/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

const mapStateToProps = (state) => {
  const {
    data: { outputResults },
  } = state;
  return { outputResults };
};

const actionCreators = {
  updateOutputResults: actions.updateOutputResults,
};

const OutputResult = (props) => {
  const { outputResults } = props;

  const handleChange = (e) => {
    const { updateOutputResults } = props;
    updateOutputResults({ value: e.target.value });
  };

  return (
    <div className="form-group">
      <label htmlFor="inputAccounts" className="col-form-label">
        Generated Accounts
      </label>
      <textarea
        type="text"
        className="form-control"
        name="logs"
        id="inputAccounts"
        placeholder="Registered accounts will be here"
        rows={5}
        value={outputResults}
        onChange={handleChange}
        readOnly
      />
    </div>
  );
};

export default connect(mapStateToProps, actionCreators)(OutputResult);
