import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import General from '../containers/General.jsx';
import Captcha from '../containers/Captcha.jsx';
import Proxy from '../containers/Proxy.jsx';
import Checker from '../containers/Checker.jsx';
import { TABS } from '../../constants/constants.js';
import ExportSettings from './ExportSettings.jsx';

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
    <Tab eventKey={TABS.EXPORT_SETTINGS} title="EXPORT SETTINGS">
      <ExportSettings />
    </Tab>
    <Tab eventKey={TABS.CHECKER} title="CHECKER">
      <Checker />
    </Tab>
  </Tabs>
);

export default NavBar;
