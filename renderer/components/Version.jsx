/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { remote } from 'electron';
import compareVersions from 'compare-versions';
import packageInfo from '../../package.json';
import { LINKS, STATUS } from '../../constants/constants.js';

const Version = () => {
  const [latestVersion, updateLatestVersion] = useState('');
  const [status, updateStatus] = useState(STATUS.VERSION.LOADING);

  const containerByStatus = {
    [STATUS.VERSION.UP_TO_DATE]: <p className="version-container text-primary">APP IS UP TO DATE</p>,
    [STATUS.VERSION.OUTDATED]: (
      <p className="version-container text-danger">
        APP IS OUTDATED. LATEST VERSION: {latestVersion}{' '}
        <a href={LINKS.LAST_VERSION} className="text-primary">
          DOWNLOAD
        </a>
      </p>
    ),
    [STATUS.VERSION.LOADING]: <p className="version-container text-primary">CHECKING FOR UPDATES</p>,
    [STATUS.VERSION.FAILED]: <p className="version-container text-danger">FAILED TO CHECK LATEST VERSION</p>,
  };

  useEffect(async () => {
    try {
      updateStatus(STATUS.VERSION.LOADING);
      const version = await axios.get(LINKS.LAST_RELEASE).then((res) => res.data.tag_name);
      updateLatestVersion(version);
      if (compareVersions.compare(version, packageInfo.version, '>')) {
        updateStatus(STATUS.VERSION.OUTDATED);
      } else {
        updateStatus(STATUS.VERSION.UP_TO_DATE);
      }
    } catch {
      updateStatus(STATUS.VERSION.FAILED);
    }
  }, []);

  return containerByStatus[status];
};

export default Version;
