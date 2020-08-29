import React from 'react';
import axios from 'axios';

const debug = async () => {
  const res = await axios
    .get('http://localhost:5000/serverstate')
    .catch(() => ({ data: 'server is down' }));
  // eslint-disable-next-line no-console
  console.log(res.data);
};

const NavTabs = () => (
  <div>
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
    <div className="float-right" style={{ marginTop: '-40px' }}>
      <button type="submit" className="btn btn-outline-secondary" onClick={debug}>
        debug
      </button>
    </div>
  </div>
);

export default NavTabs;
