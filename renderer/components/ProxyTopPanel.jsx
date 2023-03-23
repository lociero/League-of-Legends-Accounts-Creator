/* eslint-disable no-await-in-loop */
import React, { useState } from 'react';
import { remote, clipboard } from 'electron';
import axios from 'axios';
import _ from 'lodash';
import fs from 'fs';
import { Row, Form, Button, InputGroup, Spinner, Modal, Alert } from 'react-bootstrap';
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
  // const [proxyListTable, updateProxyListTable] = useGlobalState('proxyListTable');

  const [proxyCountry, updateProxyCountry] = useState('ALL');
  const [isCountriesLoading, updateCountriesLoading] = useState(false);
  const [isProxyLoading, toggleProxyLoading] = useState(false);
  const [availableCountries, updateAvailableCountries] = useState(['CHOOSE COUNTRY']);
  const [isProxyChecking, toggleProxyCheckState] = useState(false);

  const [show, setShow] = useState(false);
  const [proxyType, setProxyType] = useState('HTTP');
  const [isRotating, toggleRotating] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleTypeChange = (e) => {
    setProxyType(e.target.value);
  };

  const handleChange = () => {
    toggleProxy((prev) => !prev);
  };

  const handleCountrySelect = (e) => {
    updateProxyCountry(e.target.value);
  };

  const checkProxiesV2 = async () => {
    toggleProxy(true);
    toggleProxyCheckState((prev) => !prev);
    const data = await axios.post(`${LOCALHOST}/proxycheck`, proxyList).then((res) => res.data);
    let { isChecking } = data;
    while (isChecking) {
      await sleep(5000);
      const checkedData = await axios.get(`${LOCALHOST}/ischecking`).then((res) => res.data);
      const { checked } = checkedData;
      isChecking = checkedData.isChecking;
      const updatedList = _.unionBy(checked, proxyList, 'id');
      const sortedList = _.sortBy(updatedList, [(o) => o.id]);
      updateProxyList(sortedList);
    }
    toggleProxyCheckState((prev) => !prev);
  };

  const addProxies = (data) => {
    const parsed = parseProxies(data, proxyType, isRotating);
    const newList = [...proxyList, ...parsed].map((proxy, i) => ({ ...proxy, id: i + 1 }));
    updateProxyList(newList);
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
    addProxies(data);
    // updateProxyListTable(newList);
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
    const newList = [...proxyList, ...proxies].map((proxy, i) => ({ ...proxy, id: i + 1 }));
    updateProxyList(newList);
    // updateProxyListTable(newList);
    toggleProxyLoading(false);
  };
  return (
    <>
      <Row className="m-2 justify-content-around align-items-center">
        <Form.Check type="switch" custom id="useProxy" label="USE PROXY" onChange={handleChange} checked={useProxy} />
        <Row className="m-2 justify-content-around align-items-center">
          <Button variant="outline-primary" onClick={handleShow}>
            ADD PROXIES
          </Button>
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
      <Modal centered show={show} onHide={handleClose} keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>PROXY IMPORT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="secondary">
            Paid proxies are highly recommended! <br />
            Also I recommend to use 1 specific country. <br />
            Link 1: <Alert.Link href="https://iproyal.com?r=megaded">IPROYAL</Alert.Link> <br />
            Link 2: <Alert.Link href="https://app.proxy-cheap.com/r/0TMQxQ">PROXYCHEAP</Alert.Link> <br />
            <strong>Formats:</strong> ip:port / ip:port:username:password <br />
            <strong>Do not forget to check proxies before creation.</strong>
          </Alert>
          <InputGroup className="col-5 p-1">
            <InputGroup.Prepend>
              <InputGroup.Text id="proxyTypeSelect">TYPE</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" custom value={proxyType} onChange={handleTypeChange}>
              <option value="HTTP">HTTP</option>
              <option value="SOCKS4">SOCKS4</option>
              <option value="SOCKS5">SOCKS5</option>
            </Form.Control>
          </InputGroup>
          <Form.Check
            className="m-1"
            type="switch"
            custom
            id="isRotating"
            label="ROTATING PROXY"
            onChange={() => toggleRotating((prev) => !prev)}
            checked={isRotating}
          />
          <InputGroup className="col-12 p-1 mt-4">
            <InputGroup.Prepend>
              <InputGroup.Text id="importFromLabel">FROM</InputGroup.Text>
            </InputGroup.Prepend>
            <Button
              variant="outline-secondary"
              onClick={() => {
                const text = clipboard.readText();
                addProxies(text);
              }}
            >
              CLIPBOARD
            </Button>
            <Button style={{ margin: '0 -1px' }} variant="outline-secondary" onClick={loadFile}>
              FILE
            </Button>
            <Button
              variant="outline-secondary"
              onClick={async () => {
                const url = clipboard.readText();
                console.log('URL:', url);
                const data = await axios
                  .get(url)
                  .then((res) => res.data)
                  .catch(console.log);
                if (data) {
                  addProxies(data);
                }
              }}
            >
              URL
            </Button>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProxyTopPanel;
