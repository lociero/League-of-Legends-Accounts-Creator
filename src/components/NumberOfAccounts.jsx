/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

const mapStateToProps = state => {
  const { amount } = state;
  return { amount };
};

const actionCreators = {
  updateAmount: actions.updateAmount,
};

const NumberOfAccounts = props => {
  const { amount } = props;

  const handleChange = e => {
    const { updateAmount } = props;
    updateAmount({ value: e.target.value });
  };

  return (
    <div className="form-group col-md-4">
      <label htmlFor="inputAmount4" className="col-form-label">
        Number of accounts
      </label>
      <input
        type="number"
        name="amount"
        className="form-control"
        id="inputAmount4"
        placeholder="Enter the number of accounts"
        min="1"
        value={amount}
        onChange={handleChange}
      />
    </div>
  );
};

export default connect(mapStateToProps, actionCreators)(NumberOfAccounts);
