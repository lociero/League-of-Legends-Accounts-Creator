import React, { useState } from 'react';
import { Container, Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDonate } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons';
import { copyToClipboard } from '../../utils/utils.js';

const DonateField = ({ name, text }) => {
  const [isCopied, toggleCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(text);
    toggleCopied((prev) => !prev);
  };

  return (
    <InputGroup className="mb-3">
      <InputGroup.Prepend>
        <InputGroup.Text>{name}</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl value={text} disabled />
      <InputGroup.Append>
        {isCopied ? (
          <Button disabled variant="outline-secondary" onPointerLeave={() => toggleCopied((prev) => !prev)}>
            COPIED
          </Button>
        ) : (
          <Button variant="outline-secondary" onClick={handleCopy}>
            COPY
          </Button>
        )}
      </InputGroup.Append>
    </InputGroup>
  );
};

const Footer = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        <FontAwesomeIcon
          style={{ cursor: 'pointer' }}
          icon={faDonate}
          size="2x"
          color="grey"
          className="ml-1"
          onClick={handleShow}
        />
      </span>
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>SUPPORT ME</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DonateField name="BTC" text="bc1qnnt73euphhuvtf2phzsycmcajv2kugkjrk4xcz" />
          <DonateField name="USDT" text="TTkAQtbMGrm2PwYcV4GYyAwXJjHDUeHXAb" />
          <DonateField name="USDC" text="0x5481f0Ccb95F7b4609D6BAC12d2d88d05981f04a" />
          <DonateField name="ETH" text="0x5481f0Ccb95F7b4609D6BAC12d2d88d05981f04a" />
          <DonateField name="TRX" text="TTkAQtbMGrm2PwYcV4GYyAwXJjHDUeHXAb" />
          <DonateField name="LTC" text="LeTefZ9e8gaf7nrhZtxMY8BsWud8oDssbT" />
          <DonateField name="BINANCE" text="omgoole@ya.ru" />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Footer;
