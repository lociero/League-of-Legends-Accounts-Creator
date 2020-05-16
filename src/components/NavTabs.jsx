import React from 'react';

const NavTabs = () => (
  <ul className="nav nav-tabs" id="myTab" role="tablist">
    <li className="nav-item">
      <a
        className="nav-link active"
        id="general-tab"
        data-toggle="tab"
        href="#general"
        role="tab"
        aria-controls="general"
        aria-selected="true"
      >
        General
      </a>
    </li>
    <li className="nav-item">
      <a
        className="nav-link"
        id="captcha-tab"
        data-toggle="tab"
        href="#captcha"
        role="tab"
        aria-controls="captcha"
        aria-selected="false"
      >
        Captcha
      </a>
    </li>
    <li className="nav-item">
      <a
        className="nav-link"
        id="proxy-tab"
        data-toggle="tab"
        href="#proxy"
        role="tab"
        aria-controls="proxy"
        aria-selected="false"
      >
        Proxy
      </a>
    </li>
  </ul>
);

export default NavTabs;
