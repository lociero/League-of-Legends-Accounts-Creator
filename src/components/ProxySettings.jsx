/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

const mapStateToProps = (state) => {
  const {
    data: { useProxy, proxyList },
  } = state;
  return { useProxy, proxyList };
};

const actionCreators = {
  toggleProxyUse: actions.toggleProxyUse,
  updateProxyList: actions.updateProxyList,
};

const ProxySettings = (props) => {
  const { toggleProxyUse, useProxy, proxyList, updateProxyList } = props;
  let fileReader;

  const handleFileRead = () => {
    const content = fileReader.result;
    updateProxyList({ value: content });
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <>
      <div className="d-flex justify-content-between" style={{ marginTop: '1em' }}>
        <div className="custom-control custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customSwitch2"
            checked={useProxy}
            onChange={toggleProxyUse}
          />

          <label
            className="custom-control-label"
            htmlFor="customSwitch2"
            style={{ fontSize: '16px' }}
          >
            Use Proxy
          </label>
        </div>
        <span>
          <span className="text-info">Always download fresh proxy list b4 creation =&gt;</span>{' '}
          <a href="https://api.proxyscrape.com/?request=getproxies&proxytype=socks5&timeout=10000&country=all">
            Download socks5 proxy from ProxyScrape
          </a>
        </span>
      </div>
      <div className="form-group">
        <div className="input-group mb-3">
          <div className="custom-file" style={{ marginTop: '1em' }}>
            <input
              type="file"
              className="custom-file-input"
              accept=".txt"
              disabled={!useProxy}
              id="inputGroupFile02"
              onChange={(e) => handleFileChosen(e.target.files[0])}
            />
            <label className="custom-file-label" htmlFor="inputGroupFile02">
              Choose proxy list file
            </label>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="proxyList" className="col-form-label">
          Loaded Proxies
        </label>
        <textarea
          type="text"
          className="form-control"
          name="proxyList"
          id="proxyList"
          rows={5}
          value={proxyList}
          readOnly
        />
      </div>
    </>
  );
};

export default connect(mapStateToProps, actionCreators)(ProxySettings);
