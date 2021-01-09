import React from 'react';
import axios from 'axios';
import { remote } from 'electron';
import { isDev, LOCALHOST } from '../../constants/constants.js';

const DebugButton = () => {
  const mainDebug = async () => {
    const isOpened = remote.getCurrentWindow().isDevToolsOpened();
    if (!isOpened) {
      remote.getCurrentWindow().toggleDevTools();
    }

    const data = await axios.get(`${LOCALHOST}/serverstate`).then((res) => res.data);
    window.console.log(data);
  };
  return isDev ? (
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={mainDebug}
      style={{ position: 'absolute', right: '10px' }}
    >
      DEBUG
    </button>
  ) : null;
};

export default DebugButton;
