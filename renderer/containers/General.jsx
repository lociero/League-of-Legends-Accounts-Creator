import React from 'react';
import { Container, Row } from 'react-bootstrap';
import ServerSelect from '../components/ServerSelect.jsx';
import NumberOfAccounts from '../components/NumberOfAccounts.jsx';
import DateOfBirth from '../components/DateOfBirth.jsx';
import Username from '../components/Username.jsx';
import Password from '../components/Password.jsx';
import EmailMask from '../components/EmailMask.jsx';
import Generation from '../components/Generation.jsx';

const General = () => (
  <Container fluid>
    <Row className="align-items-center">
      <ServerSelect />
      <Password />
      <Username />
    </Row>
    <Row className="align-items-center">
      <NumberOfAccounts />
      <DateOfBirth />
      <EmailMask />
    </Row>
    <Generation />
  </Container>
);

export default General;
