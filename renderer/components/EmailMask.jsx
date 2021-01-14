import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import ReactTooltip from 'react-tooltip';
import useGlobalState from '../state.js';
import { EMAIL_SETTINGS_TYPES, STATE_NAMES, FILE_NAMES } from '../../constants/constants.js';

const EmailMask = () => {
  const [emailMask, updateEmailMask] = useGlobalState(STATE_NAMES.EMAIL_MASK);
  const [emailSetType, updateEmailSetType] = useGlobalState(STATE_NAMES.EMAIL_SETTINGS_TYPE);

  const handleEmailMaskChange = (e) => {
    updateEmailMask(e.target.value);
  };

  const handleEmailSetTypeChange = (e) => {
    updateEmailSetType(e.target.value);
  };

  return (
    <>
      <InputGroup className="col-5 p-1">
        <InputGroup.Prepend>
          <InputGroup.Text>
            {EMAIL_SETTINGS_TYPES.ONE_FOR_ALL === emailSetType ? 'EMAIL MASK' : 'EMAIL'}
          </InputGroup.Text>
          {EMAIL_SETTINGS_TYPES.ONE_FOR_ALL === emailSetType ? <InputGroup.Text>{'<username>'}</InputGroup.Text> : null}
        </InputGroup.Prepend>
        {EMAIL_SETTINGS_TYPES.ONE_FOR_ALL === emailSetType ? (
          <Form.Control value={emailMask} onChange={handleEmailMaskChange} />
        ) : null}
        <Form.Control as="select" custom value={emailSetType} onChange={handleEmailSetTypeChange}>
          {Object.values(EMAIL_SETTINGS_TYPES).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Form.Control>
      </InputGroup>
      <FontAwesomeIcon
        icon={faQuestionCircle}
        size="2x"
        color="grey"
        className="m-1 mr-2"
        data-for="email_info"
        data-tip
      />
      <ReactTooltip id="email_info" effect="solid" place="left">
        <p className="m-0">
          <strong>RANDOM:</strong> username + random domain
          <br />
          <strong>ONE FOR ALL:</strong> {`username + ${emailMask}`}
          <br />
          <strong>CUSTOM:</strong> Emails from {FILE_NAMES.CUSTOM_EMAILS}
        </p>
      </ReactTooltip>
    </>
  );
};

export default EmailMask;
