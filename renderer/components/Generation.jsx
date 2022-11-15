/* eslint-disable no-await-in-loop */
import React, { useState } from 'react';
import { remote, shell } from 'electron';
import { Button, ProgressBar, Container, Spinner, Row, ButtonGroup, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';
import AccountsTable from './AccountsTable.jsx';
import useGlobalState from '../state.js';
import save from '../save.js';
import { STATE_NAMES, LOCALHOST, dirname, STATUS, isDev } from '../../constants/constants.js';
import { sleep, parseTemplate, copyToClipboard } from '../../utils/utils.js';

const Generation = () => {
  const [accounts, updateAccounts] = useState([]);
  // const [accounts, updateAccounts] = useGlobalState('accounts');
  const [show, setShow] = useState(false);
  const [customTemplate] = useGlobalState(STATE_NAMES.CUSTOM_TEMPLATE);

  const [isCopied, toggleCopied] = useState(false);

  const handleCopy = (text) => {
    copyToClipboard(text);
    toggleCopied((prev) => !prev);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isGeneratingAccs, toggleGenerating] = useState(false);
  const [isCreating, toggleCreating] = useState(false);
  const [rateLimitedProxiesCount, updateRateLimitedProxiesCount] = useState(0);

  const [isStopped, toggleStopped] = useState(false);

  const successAccounts = accounts.filter(({ status }) => status === STATUS.ACCOUNT.SUCCESS);
  const finishedAccounts = accounts.filter(
    ({ status }) => ![STATUS.ACCOUNT.GENERATED, STATUS.ACCOUNT.IN_PROGRESS].includes(status)
  );

  const state = Object.values(STATE_NAMES).reduce((acc, key) => {
    const [value] = useGlobalState(key);
    return { ...acc, [key]: value };
  }, {});

  const stopCreation = async () => {
    toggleStopped(true);
    await axios.post(`${LOCALHOST}/stop_creation`);
  };

  const generateConfig = async () => {
    toggleGenerating(true);
    const data = await axios.post(`${LOCALHOST}/generate`, { state }).then((res) => res.data);
    updateAccounts(data);
    toggleGenerating(false);
  };

  const startCreation = async () => {
    const captchaKeysProvided = ![state.apiKey, state.dbcUsername, state.dbcPassword].every((key) => key.length === 0);
    if (!captchaKeysProvided) {
      const messageBoxOptions = {
        type: 'error',
        title: 'Captcha apikey is missing',
        message: 'You need api key from some captcha service.\nOpen CAPTCHA tab for more information.',
      };
      remote.dialog.showMessageBox(messageBoxOptions);
      return;
    }
    toggleCreating(true);
    const body = {
      currentCaptcha: state.currentCaptcha,
      apiKey: state.apiKey,
      username: state.dbcUsername,
      password: state.dbcPassword,
      useProxy: state.useProxy,
    };
    const data = await axios.post(`${LOCALHOST}/signup`, body).then((res) => res.data);
    updateAccounts(data.list);
    let { isGenerating } = data;
    while (isGenerating) {
      await sleep(5000);
      const currentAccountsState = await axios.get(`${LOCALHOST}/signup`).then((res) => res.data);
      const { list, rateLimitedProxies, isCreationStopped } = currentAccountsState;
      toggleStopped(isCreationStopped);
      isGenerating = currentAccountsState.isGenerating;
      const updatedList = _.unionBy(list, data.list, 'id');
      const sortedList = _.sortBy(updatedList, [(o) => o.id]);
      updateAccounts(sortedList);
      updateRateLimitedProxiesCount(rateLimitedProxies);
    }
    toggleCreating(false);
    const { list } = await axios.get(`${LOCALHOST}/signup`).then((res) => res.data);

    if (!isDev) {
      save(list, state);
    }
  };
  return (
    <>
      <Row className="pl-1">
        <p className="text-primary m-0 mr-2">GENERATED:{` ${accounts.length}`}</p>
        <p className="text-primary m-0 mr-2">FINISHED:{` ${finishedAccounts.length}/${accounts.length}`}</p>
        <p className="text-primary m-0 mr-2">SUCCESSFULLY CREATED:{` ${successAccounts.length}/${accounts.length}`}</p>
        <p className="text-primary m-0 mr-2">RATE LIMITED PROXIES: {rateLimitedProxiesCount}</p>
      </Row>
      <Row className="pl-1">
        {!isCreating && successAccounts.length > 0 ? (
          <>
            <p className="text-primary m-0 mr-2">
              SAVED TO: <a href="#" onClick={() => shell.openPath(`${dirname}\\accounts`)}>{`${dirname}\\accounts`}</a>
            </p>
            <p className="text-primary m-0 mr-2">
              WASNT SAVED?{' '}
              <a href="#" onClick={handleShow}>
                CLICK ME
              </a>
            </p>
          </>
        ) : null}
      </Row>
      <AccountsTable accounts={accounts} />

      <Container fluid className="p-0">
        <ProgressBar style={{ paddingRight: 1 }} animated now={(finishedAccounts.length / accounts.length) * 100} />

        <ButtonGroup className="d-flex mb-5">
          {isGeneratingAccs ? (
            <Button variant="outline-secondary" className="col-6" disabled>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> GENERATING
            </Button>
          ) : (
            <Button variant="outline-secondary" disabled={isCreating} className="col-6" onClick={generateConfig}>
              GENERATE
            </Button>
          )}

          {isCreating ? (
            <Button variant="outline-danger" className="col-6" disabled={isStopped} onClick={() => stopCreation()}>
              {isStopped ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> STOPPING
                </>
              ) : (
                'STOP CREATION'
              )}
            </Button>
          ) : (
            <Button
              variant="outline-secondary"
              disabled={accounts.length < 1 || accounts.some(({ status }) => status !== 'GENERATED')}
              className="col-6"
              onClick={startCreation}
            >
              START CREATION
            </Button>
          )}
        </ButtonGroup>
        <Modal centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              EMERGENCY SAVE <br />
              [CUSTOM EXPORT TEMPLATE IS USED]
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              as="textarea"
              rows={6}
              style={{ resize: 'none', whiteSpace: 'pre' }}
              disabled
              value={successAccounts.map((account) => parseTemplate({ template: customTemplate }, account)).join('\n')}
            />
          </Modal.Body>
          <Modal.Footer>
            {isCopied ? (
              <Button disabled variant="outline-secondary" onPointerLeave={() => toggleCopied((prev) => !prev)}>
                COPIED
              </Button>
            ) : (
              <Button
                variant="outline-secondary"
                onClick={() => {
                  const text = successAccounts
                    .map((account) => parseTemplate({ template: customTemplate }, account))
                    .join('\n');
                  handleCopy(text);
                }}
              >
                COPY
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Generation;
