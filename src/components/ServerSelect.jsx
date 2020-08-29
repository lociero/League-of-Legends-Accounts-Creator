/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index.js';

const mapStateToProps = (state) => {
  const {
    data: { serverName },
  } = state;
  return { serverName };
};

const actionCreators = {
  updateServer: actions.updateServer,
};

const ServerSelect = (props) => {
  const { serverName } = props;

  const handleChange = (e) => {
    const { updateServer } = props;
    updateServer({ value: e.target.value });
  };

  return (
    <div className="form-group col-md-6">
      <label htmlFor="inputServer" className="col-form-label">
        Server
      </label>
      <select
        id="inputServer"
        name="server"
        className="form-control"
        value={serverName}
        onChange={handleChange}
      >
        <option value="EUW">EUW</option>
        <option value="EUNE">EUNE</option>
        <option value="NA">NA</option>
        <option value="BR">BR</option>
        <option value="TR">TR</option>
        <option value="RU">RU</option>
        <option value="OCE">OCE</option>
        <option value="LAN">LAN</option>
        <option value="LAS">LAS</option>
      </select>
    </div>
  );
};

export default connect(mapStateToProps, actionCreators)(ServerSelect);
