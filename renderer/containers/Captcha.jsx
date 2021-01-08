import React, { useState } from 'react';
import { Container, Row, InputGroup, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import useGlobalState from '../state.js';
import { STATE_NAMES, CAPTCHA_SERVICES, LINKS, LOCALHOST } from '../constants.js';

const Captcha = () => {
  const [currentCaptcha, updateCurrentCaptcha] = useGlobalState(STATE_NAMES.CURRENT_CAPTCHA);
  const [apiKey, updateApiKey] = useGlobalState(STATE_NAMES.API_KEY);
  const [dbcUsername, updateDbcUsername] = useGlobalState(STATE_NAMES.DBC_USERNAME);
  const [dbcPassword, updateDbcPassword] = useGlobalState(STATE_NAMES.DBC_PASSWORD);
  const [balance, updateBalance] = useState('');
  const [isChecking, toggleCheckingBalance] = useState('');

  const handleCurrentCaptchaChange = (e) => {
    updateCurrentCaptcha(e.target.value);
  };

  const handleApiKeyChange = (e) => {
    updateApiKey(e.target.value);
  };
  const handleUsernameChange = (e) => {
    updateDbcUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    updateDbcPassword(e.target.value);
  };

  const checkBalance = async () => {
    toggleCheckingBalance((prev) => !prev);
    const body = {
      currentCaptcha,
      apiKey,
      username: dbcUsername,
      password: dbcPassword,
    };
    const data = await axios
      .post(`${LOCALHOST}/getbalance`, body)
      .then((res) => res.data)
      .catch((err) => err.response.data);
    // console.log(data);
    updateBalance(data.balance);
    toggleCheckingBalance((prev) => !prev);
  };

  return (
    <Container fluid>
      <Row>
        <InputGroup className="col-6 p-1">
          <InputGroup.Prepend>
            <InputGroup.Text>DON&apos;T HAVE AN ACCOUNT YET?</InputGroup.Text>
          </InputGroup.Prepend>
          <Button href={LINKS.CAPTCHA_SIGNUP[currentCaptcha]} variant="outline-secondary">
            {`SIGN UP FOR ${currentCaptcha}`}
          </Button>
        </InputGroup>
      </Row>
      <Row>
        <InputGroup className="col-6 p-1">
          <InputGroup.Prepend>
            <InputGroup.Text>CAPTCHA SERVICE</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control as="select" custom value={currentCaptcha} onChange={handleCurrentCaptchaChange}>
            {Object.values(CAPTCHA_SERVICES).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Form.Control>
        </InputGroup>
      </Row>
      <Row>
        {currentCaptcha === CAPTCHA_SERVICES.DBC ? (
          <InputGroup className="col-6 p-1">
            <InputGroup.Prepend>
              <InputGroup.Text>DBC CREDENTIALS</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control placeholder="USERNAME" value={dbcUsername} onChange={handleUsernameChange} />
            <Form.Control placeholder="PASSWORD" value={dbcPassword} type="password" onChange={handlePasswordChange} />
          </InputGroup>
        ) : (
          <InputGroup className="col-6 p-1">
            <InputGroup.Prepend>
              <InputGroup.Text>API KEY</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control placeholder="ENTER YOUR API KEY" value={apiKey} onChange={handleApiKeyChange} />
          </InputGroup>
        )}
      </Row>
      <Row>
        <InputGroup className="col-6 p-1">
          <InputGroup.Prepend>
            {isChecking ? (
              <Button variant="outline-secondary" disabled>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> CHECKING
              </Button>
            ) : (
              <Button variant="outline-secondary" onClick={checkBalance}>
                CHECK BALANCE
              </Button>
            )}
          </InputGroup.Prepend>
          <Form.Control className="border border-secondary" disabled value={balance} />
        </InputGroup>
      </Row>
    </Container>
  );
};

export default Captcha;
