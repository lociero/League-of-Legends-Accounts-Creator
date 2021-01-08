/* eslint-disable no-await-in-loop */
import React from 'react';
import { Container } from 'react-bootstrap';
import ProxyTopPanel from '../components/ProxyTopPanel.jsx';
import ProxyTable from '../components/ProxyTable.jsx';

const Proxy = () => {
  return (
    <Container fluid>
      <ProxyTopPanel />
      <ProxyTable />
    </Container>
  );
};

export default Proxy;
