/* eslint-disable no-await-in-loop */
import React, { useState } from 'react';
import { Button, ProgressBar, Container, Col, Spinner, Row } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';
import AccountsTable from './AccountsTable.jsx';
import useGlobalState from '../state.js';
import save from '../save.js';
import { STATE_NAMES, LOCALHOST, dirname } from '../constants.js';
import { sleep } from '../util.js';

const Generation = () => {
  const [accounts, updateAccounts] = useState([]);
  // const [accounts, updateAccounts] = useGlobalState('accounts');

  const [isGeneratingAccs, toggleGenerating] = useState(false);
  const [isCreating, toggleCreating] = useState(false);

  const successAccounts = accounts.filter(({ status }) => status === 'SUCCESS');
  const finishedAccounts = accounts.filter(({ status }) => !['GENERATED', 'IN PROGRESS'].includes(status));

  const state = Object.values(STATE_NAMES).reduce((acc, key) => {
    const [value] = useGlobalState(key);
    return { ...acc, [key]: value };
  }, {});

  const generateConfig = async () => {
    toggleGenerating(true);
    const data = await axios.post(`${LOCALHOST}/generate`, { state }).then((res) => res.data);
    updateAccounts(data);
    toggleGenerating(false);
  };

  const startCreation = async () => {
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
      const { list } = currentAccountsState;
      isGenerating = currentAccountsState.isGenerating;
      const updatedList = _.unionBy(list, data.list, 'id');
      const sortedList = _.sortBy(updatedList, [(o) => o.id]);
      updateAccounts(sortedList);
    }
    toggleCreating(false);
    const { list } = await axios.get(`${LOCALHOST}/signup`).then((res) => res.data);
    save(list, state);
  };
  return (
    <>
      <Row className="p-1">
        <p className="text-primary m-0 mr-2">GENERATED:{` ${accounts.length}`}</p>
        <p className="text-primary m-0 mr-2">SUCCESSFULLY CREATED:{` ${successAccounts.length}/${accounts.length}`}</p>
        {!isCreating && successAccounts.length > 0 ? (
          <p className="text-primary m-0 mr-2 blink">SAVED TO: {`${dirname}\\accounts`}</p>
        ) : null}
      </Row>
      <AccountsTable accounts={accounts} />

      <Container fluid className="p-0">
        <ProgressBar animated now={(finishedAccounts.length / accounts.length) * 100} className="mb-1 ml-0" />

        <Col className="pl-0 pr-0 pb-5  d-flex justify-space-between">
          {isGeneratingAccs ? (
            <Button variant="outline-secondary" className="col-6" style={{ marginRight: '-1px' }} disabled>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> GENERATING
            </Button>
          ) : (
            <Button
              variant="outline-secondary"
              disabled={isCreating}
              className="col-6"
              style={{ marginRight: '-1px' }}
              onClick={generateConfig}
            >
              GENERATE
            </Button>
          )}

          {isCreating ? (
            <Button variant="outline-secondary" className="col-6" disabled>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> CREATING
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
        </Col>
      </Container>
    </>
  );
};

export default Generation;
