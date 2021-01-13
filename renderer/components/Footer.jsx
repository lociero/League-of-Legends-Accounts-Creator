import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { MDBTooltip } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTelegram, faPaypal, faGithub } from '@fortawesome/free-brands-svg-icons';
import { copyToClipboard, sleep } from '../../utils/utils.js';
// import { faGit } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const [tooltipText, updateTooltipText] = useState('CLICK TO COPY');
  const discordNameToClipboard = async () => {
    updateTooltipText('COPIED');
    copyToClipboard('megaded#1529');
    await sleep(1000);
    updateTooltipText('CLICK TO COPY');
  };
  return (
    <Container fluid className="text-right p-0 pt-1">
      <span className="pt-3 mr-3">
        <MDBTooltip domElement placement="top" className="mt-2">
          <span className="pt-3">
            <a href="#">
              <FontAwesomeIcon icon={faDiscord} size="2x" color="grey" onClick={discordNameToClipboard} />
            </a>
          </span>
          <p className="m-1">{tooltipText}</p>
        </MDBTooltip>
        <a href="https://t.me/frolovdmitriy">
          <FontAwesomeIcon icon={faTelegram} size="2x" color="grey" className="ml-1" />
        </a>
        <a href="https://github.com/lociero/League-of-Legends-Accounts-Creator">
          <FontAwesomeIcon icon={faGithub} size="2x" color="grey" className="ml-1" />
        </a>
        <a href="https://www.paypal.me/lociero">
          <FontAwesomeIcon icon={faPaypal} size="2x" color="grey" className="ml-1" />
        </a>
      </span>
    </Container>
  );
};

export default Footer;
