import React from 'react';
import { Container } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTelegram, faPaypal, faGithub } from '@fortawesome/free-brands-svg-icons';
import { copyToClipboard } from '../../utils/utils.js';

const Footer = () => {
  const discordNameToClipboard = () => {
    copyToClipboard('megaded#1529');
  };

  return (
    <Container fluid className="text-right p-0 pt-1">
      <span className="mr-3">
        <a href="#" data-for="discordClipboard" data-event="click" data-tip="COPIED" data-event-off="mouseleave">
          <FontAwesomeIcon icon={faDiscord} size="2x" color="grey" onClick={discordNameToClipboard} />
        </a>
        <ReactTooltip id="discordClipboard" type="success" effect="solid" isCapture={true} />
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
