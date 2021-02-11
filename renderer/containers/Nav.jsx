import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import General from './General.jsx';
import Captcha from './Captcha.jsx';
import Proxy from './Proxy.jsx';
import { TABS } from '../../constants/constants.js';

const NavBar = () => (
  <Tabs defaultActiveKey={TABS.GENERAL} id="uncontrolled-tab-example">
    <Tab eventKey={TABS.GENERAL} title="GENERAL">
      <General />
    </Tab>
    <Tab eventKey={TABS.CAPTCHA} title="CAPTCHA">
      <Captcha />
    </Tab>
    <Tab eventKey={TABS.PROXY} title="PROXY">
      <Proxy />
    </Tab>
    <Tab eventKey={TABS.CHECKER} title="CHECKER [DISABLED]"></Tab>
  </Tabs>
);

export default NavBar;
