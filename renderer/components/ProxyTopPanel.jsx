/* eslint-disable no-await-in-loop */
import React, { useState } from 'react';
import { remote } from 'electron';
import axios from 'axios';
import _ from 'lodash';
import fs from 'fs';
import { Row, Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import useGlobalState from '../state.js';
import { sleep, parseProxies } from '../../utils/utils.js';
import { STATE_NAMES, LOCALHOST } from '../../constants/constants.js';
import countriesByCode from '../../constants/countries.json';
import ProxyLoader from '../../utils/proxy.js';

const ProxyTopPanel = () => {
  const [useProxy, toggleProxy] = useGlobalState(STATE_NAMES.USE_PROXY);
  const [proxyList, updateProxyList] = useGlobalState(STATE_NAMES.PROXY_LIST);
  const [proxyListTable, updateProxyListTable] = useGlobalState('proxyListTable');

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

  const checkProxiesV2 = async () => {
    toggleProxy(true);
    toggleProxyCheckState((prev) => !prev);
    const data = await axios.post(`${LOCALHOST}/proxycheck`, proxyListTable).then((res) => res.data);
    let { isChecking } = data;
    while (isChecking) {
      await sleep(5000);
      const checkedData = await axios.get(`${LOCALHOST}/ischecking`).then((res) => res.data);
      const { checked } = checkedData;
      isChecking = checkedData.isChecking;
      const updatedList = _.unionBy(checked, proxyListTable, 'id');
      const sortedList = _.sortBy(updatedList, [(o) => o.id]);
      updateProxyListTable(sortedList);
    }
    toggleProxyCheckState((prev) => !prev);
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
    const parsed = parseProxies(data);
    updateProxyList(parsed);
    updateProxyListTable(parsed);
  };

  const proxyLoader = React.useMemo(() => new ProxyLoader(), []);

  const initProxyHandler = async () => {
    updateCountriesLoading(true);
    const { countries } = await proxyLoader.init();
    updateAvailableCountries(countries);
    updateCountriesLoading(false);
  };

  const downloadProxies = async () => {
    toggleProxyLoading(true);
    const proxies = await proxyLoader.download(proxyCountry);
    updateProxyList(proxies);
    updateProxyListTable(proxies);
    toggleProxyLoading(false);
  };
  return (
    <Row className="m-2 justify-content-around align-items-center">
      <Form.Check type="switch" custom id="useProxy" label="USE PROXY" onChange={handleChange} checked={useProxy} />
      <Row className="m-2 justify-content-around align-items-center">
        <Button variant="outline-primary" onClick={loadFile}>
          LOAD YOUR OWN PROXIES
        </Button>
        <FontAwesomeIcon
          icon={faQuestionCircle}
          size="2x"
          className="ml-1 text-primary"
          data-for="own_proxy_info"
          data-tip
        />
        <ReactTooltip id="own_proxy_info" effect="solid" place="right">
          <p className="m-0">
            SOCKS4/SOCKS5/HTTP
            <br />
            Each proxy on a new line
            <br />
            IP:PORT:TYPE
            <br />
            IP:PORT:TYPE@USERNAME:PASSWORD
            <br />
            123.123.123.123:1234:SOCKS4
            <br />
            123.123.123.123:1234:HTTP@USER:PASS
          </p>
        </ReactTooltip>
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
            {availableCountries.map((code) => (
              <option key={code} value={code}>
                {countriesByCode[code]?.toUpperCase() ?? code}
              </option>
            ))}
          </Form.Control>
          <InputGroup.Append>
            {/* <Button variant="outline-primary" onClick={handleUpdateCountries}> */}
            <Button variant="outline-primary" onClick={initProxyHandler}>
              {isCountriesLoading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                <FontAwesomeIcon icon={faSyncAlt} />
              )}
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <FontAwesomeIcon
          icon={faQuestionCircle}
          size="2x"
          className="ml-1 text-primary"
          data-for="free_proxy_info"
          data-tip
        />
        <ReactTooltip id="free_proxy_info" effect="solid" place="right">
          <p className="m-0">
            Update to load availabe countries
            <br />
            You can add different countries one by one
            <br />
            Added something extra? Clean table
            <br />
            Dont forget to check proxies before creation
          </p>
        </ReactTooltip>
      </Row>
      {isProxyChecking ? (
        <Button variant="outline-primary" disabled>
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> CHECKING
        </Button>
      ) : (
        <Button variant="outline-primary" onClick={checkProxiesV2} disabled={proxyList.length < 1}>
          CHECK
        </Button>
      )}
    </Row>
  );
};

export default ProxyTopPanel;
