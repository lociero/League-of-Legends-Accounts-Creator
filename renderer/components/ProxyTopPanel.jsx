/* eslint-disable no-await-in-loop */
import React, { useState } from 'react';
import { remote } from 'electron';
import axios from 'axios';
import _ from 'lodash';
import fs from 'fs';
import { Row, Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { MDBTooltip } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import useGlobalState from '../state.js';
import { sleep, parseProxies } from '../util.js';
import { LINKS, STATE_NAMES, LOCALHOST } from '../constants.js';

const ProxyTopPanel = () => {
  const [useProxy, toggleProxy] = useGlobalState(STATE_NAMES.USE_PROXY);
  const [proxyList, updateProxyList] = useGlobalState(STATE_NAMES.PROXY_LIST);

  const [proxyCountry, updateProxyCountry] = useState('ALL');
  const [isCountriesLoading, updateCountriesLoading] = useState(false);
  const [isProxyLoading, toggleProxyLoading] = useState(false);
  const [availableCountries, updateAvailableCountries] = useState(['CHOOSE COUNTRY']);
  const [isProxyChecking, toggleProxyCheckState] = useState(false);

  const handleChange = () => {
    toggleProxy((prev) => !prev);
  };

  const handleCountrySelect = (e) => {
    updateProxyCountry(e.target.value);
  };

  const checkProxies = async () => {
    toggleProxy(true);
    toggleProxyCheckState((prev) => !prev);
    const data = await axios.post(`${LOCALHOST}/proxycheck`, proxyList).then((res) => res.data);
    let { isChecking } = data;
    while (isChecking) {
      await sleep(2000);
      const checkedData = await axios.get(`${LOCALHOST}/ischecking`).then((res) => res.data);
      const { checked } = checkedData;
      isChecking = checkedData.isChecking;
      const updatedList = _.unionBy(checked, proxyList, 'id');
      const sortedList = _.sortBy(updatedList, [(o) => o.id]);
      updateProxyList(sortedList);
    }
    toggleProxyCheckState((prev) => !prev);
  };

  const downloadProxies = async () => {
    try {
      toggleProxyLoading(true);
      const socks4 = await axios.get(`${LINKS.PROXIES_SOCKS4}&country=${proxyCountry}`).then((res) => res.data);
      const socks4List = socks4
        .split('\n')
        .filter(Boolean)
        .map((proxy) => `${proxy}:SOCKS4`);
      const socks5 = await axios.get(`${LINKS.PROXIES_SOCKS5}&country=${proxyCountry}`).then((res) => res.data);
      const socks5List = socks5
        .split('\n')
        .filter(Boolean)
        .map((proxy) => `${proxy}:SOCKS5`);
      const finalList = [...socks4List, ...socks5List].map((proxy, i) => {
        const [ip, port, type] = proxy.split(':');
        return {
          id: proxyList.length > 0 ? _.last(proxyList).id + i + 1 : i + 1,
          ip,
          port,
          type,
          country: proxyCountry,
        };
      });
      updateProxyList([...proxyList, ...finalList]);
      toggleProxyLoading(false);
    } catch (e) {
      downloadProxies();
    }
  };

  const loadAvailableCountries = async () => {
    const socks4 = await axios.get(LINKS.INFO_SOCKS4).then((res) => res.data.countries);
    const socks5 = await axios.get(LINKS.INFO_SOCKS5).then((res) => res.data.countries);
    return [...new Set(['ALL', ...socks4, ...socks5])].sort();
  };

  const handleUpdateCountries = async () => {
    try {
      updateCountriesLoading(true);
      const countries = await loadAvailableCountries();
      updateAvailableCountries(countries);
      updateCountriesLoading(false);
    } catch (e) {
      handleUpdateCountries();
    }
  };
  const loadFile = async () => {
    const { dialog } = remote;
    const {
      filePaths: [filepath],
    } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Text Files', extensions: ['txt'] }],
    });
    if (!filepath) {
      return;
    }
    const data = fs.readFileSync(filepath, 'utf-8');

    updateProxyList(parseProxies(data));
  };
  return (
    <Row className="m-2 justify-content-around align-items-center">
      <Form.Check type="switch" custom id="useProxy" label="USE PROXY" onChange={handleChange} checked={useProxy} />
      <Row className="m-2 justify-content-around align-items-center">
        <Button variant="outline-primary" onClick={loadFile}>
          LOAD YOUR OWN PROXIES
        </Button>
        <MDBTooltip domElement placement="right">
          <span>
            <FontAwesomeIcon icon={faQuestionCircle} size="2x" className="ml-1 text-primary" />
          </span>
          <p className="m-1">
            Only socks4/5
            <br />
            Each proxy on a new line
            <br />
            IP:PORT:TYPE
            <br />
            null type will be tagged as both
            <br />
            123.123.123.123:1234:SOCKS4
            <br />
            123.123.123.123:1234:SOCKS5
          </p>
        </MDBTooltip>
      </Row>
      <Row className="m-2 justify-content-around align-items-center">
        <InputGroup className="w-auto">
          <InputGroup.Prepend>
            {isProxyLoading ? (
              <Button variant="outline-primary" disabled>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> DOWNLOADING
              </Button>
            ) : (
              <Button variant="outline-primary" onClick={downloadProxies} disabled={availableCountries.length < 2}>
                GET FREE PROXIES
              </Button>
            )}
          </InputGroup.Prepend>
          <Form.Control
            className="border border-primary"
            as="select"
            custom
            disabled={availableCountries.length < 2}
            value={proxyCountry}
            onChange={handleCountrySelect}
          >
            {availableCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Form.Control>
          <InputGroup.Append>
            <Button variant="outline-primary" onClick={handleUpdateCountries}>
              {isCountriesLoading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                <FontAwesomeIcon icon={faSyncAlt} />
              )}
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <MDBTooltip domElement placement="right">
          <span>
            <FontAwesomeIcon icon={faQuestionCircle} size="2x" className="ml-1 text-primary" />
          </span>
          <p className="m-1">
            Update to load availabe countries
            <br />
            You can add different countries one by one
            <br />
            Added something extra? Clean table
            <br />
            Dont forget to check proxies before creation
          </p>
        </MDBTooltip>
      </Row>
      {isProxyChecking ? (
        <Button variant="outline-primary" disabled>
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> CHECKING
        </Button>
      ) : (
        <Button variant="outline-primary" onClick={checkProxies} disabled={proxyList.length < 1}>
          CHECK
        </Button>
      )}
    </Row>
  );
};

export default ProxyTopPanel;
