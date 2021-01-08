import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import useGlobalState from '../state.js';
import { validatePassword } from '../util.js';
import { PASSWORD_SETTINGS_TYPES, STATE_NAMES } from '../constants.js';

const Username = () => {
  const [passwordLength, updatepasswordLength] = useGlobalState(STATE_NAMES.PASSWORD_LENGTH);
  const [passwordSetType, updatePasswordSetType] = useGlobalState(STATE_NAMES.PASSWORD_SET_TYPE);
  const [passwordOneForAll, updatepasswordOneForAll] = useGlobalState(STATE_NAMES.PASSWORD_ONE_FOR_ALL);

  const handleValueChange = (e) => {
    updatepasswordLength(e.target.value);
  };

  const handlePasswordChange = (e) => {
    updatepasswordOneForAll(e.target.value);
  };

  const handlePasswordSetTypeChange = (e) => {
    updatePasswordSetType(e.target.value);
  };

  return (
    <>
      <InputGroup className="col-4 p-1">
        <InputGroup.Prepend>
          <InputGroup.Text>
            {passwordSetType === PASSWORD_SETTINGS_TYPES.RANDOM ? 'PASSWORD LENGTH' : 'PASSWORD'}
          </InputGroup.Text>
        </InputGroup.Prepend>
        {passwordSetType === PASSWORD_SETTINGS_TYPES.ONE_FOR_ALL ? (
          <Form.Control
            value={passwordOneForAll}
            isValid={validatePassword(passwordOneForAll)}
            isInvalid={!validatePassword(passwordOneForAll)}
            onChange={handlePasswordChange}
          />
        ) : (
          <Form.Control type="number" min="8" max="128" value={passwordLength} onChange={handleValueChange} />
        )}
        <InputGroup.Append>
          <Form.Control as="select" custom value={passwordSetType} onChange={handlePasswordSetTypeChange}>
            {Object.values(PASSWORD_SETTINGS_TYPES).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Control>
        </InputGroup.Append>
      </InputGroup>
    </>
  );
};

export default Username;
