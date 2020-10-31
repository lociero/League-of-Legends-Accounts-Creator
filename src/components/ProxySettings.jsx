/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../actions/index.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mapStateToProps = (state) => {
  const {
    data: { useProxy, proxyList, isProxyChecking, isGettingProxy, proxyCountry },
  } = state;
  return { useProxy, proxyList, isProxyChecking, isGettingProxy, proxyCountry };
};

const actionCreators = {
  toggleProxyUse: actions.toggleProxyUse,
  updateProxyList: actions.updateProxyList,
  updateProxyChecking: actions.updateProxyChecking,
  updateProxyGettingState: actions.updateProxyGettingState,
  updateProxyCountry: actions.updateProxyCountry,
};

const ProxySettings = (props) => {
  const {
    toggleProxyUse,
    useProxy,
    proxyList,
    isProxyChecking,
    updateProxyChecking,
    updateProxyList,
    isGettingProxy,
    updateProxyGettingState,
    proxyCountry,
  } = props;

  const handleChange = (e) => {
    const { updateProxyCountry } = props;
    updateProxyCountry({ value: e.target.value });
  };

  const proxyCheck = async () => {
    updateProxyChecking({ value: true });
    await axios.post('http://localhost:5000/proxycheck').catch(() => ({ data: {} }));
    let isChecking = true;
    while (isChecking) {
      const res2 = await axios.get('http://localhost:5000/ischecking').catch(() => ({ data: {} }));
      isChecking = res2.data.isChecking;
      updateProxyList({ value: res2.data.list.join('\n') });
      updateProxyChecking({ value: res2.data.isChecking });
      await sleep(1000);
    }
    const res3 = await axios.get('http://localhost:5000/ischecking').catch(() => ({ data: {} }));
    updateProxyList({ value: res3.data.list.join('\n') });
  };

  const getProxies = async () => {
    updateProxyGettingState({ value: true });
    const res = await axios
      .get(
        `https://api.proxyscrape.com/?request=getproxies&proxytype=socks4&timeout=10000&country=${proxyCountry}`,
      )
      .catch(() => ({ data: 'error' }));
    if (res.data === 'error') {
      getProxies();
      return;
    }
    updateProxyList({ value: res.data.trim() });
    const res2 = await axios.post('http://localhost:5000/updateproxylist', { list: res.data });
    console.log('Loaded proxies:');
    console.log(res2.data);
    updateProxyGettingState({ value: false });
    proxyCheck();
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
        <div className="input-group w-auto">
          <select
            id="selectCountry"
            name="server"
            className="form-control"
            value={proxyCountry}
            onChange={handleChange}
          >
            <option value="all">ALL</option>
            <option value="BR">BR</option>
            <option value="DE">DE</option>
            <option value="ES">ES</option>
            <option value="FR">FR</option>
            <option value="IN">IN</option>
            <option value="IT">IT</option>
            <option value="PL">PL</option>
            <option value="TR">TR</option>
            <option value="RU">RU</option>
            <option value="UA">UA</option>
            <option value="US">US</option>
          </select>
          {!isGettingProxy ? (
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={getProxies}
              disabled={!useProxy || isProxyChecking}
            >
              Get Proxies
            </button>
          ) : (
            <button className="btn btn-outline-primary" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              {' Downloading...'}
            </button>
          )}
        </div>
        {!isProxyChecking ? (
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={proxyList.length < 2}
            onClick={proxyCheck}
          >
            Check proxies
          </button>
        ) : (
          <button className="btn btn-outline-primary" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            {' Checking...'}
          </button>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="proxyList" className="col-form-label">
          Loaded Proxies [{proxyList.split('\n').filter(Boolean).length}]
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
