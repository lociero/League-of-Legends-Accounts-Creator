import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import useGlobalState from '../state.js';
import { SERVERS, STATE_NAMES } from '../../constants/constants.js';

const ServerSelect = () => {
  const [serverName, updateServer] = useGlobalState(STATE_NAMES.SERVER_NAME);

  const handleChange = (e) => {
    updateServer(e.target.value);
  };

  return (
    <InputGroup className="col-2 p-1">
      <InputGroup.Prepend>
        <InputGroup.Text id="serverSelect">SERVER</InputGroup.Text>
      </InputGroup.Prepend>
      <Form.Control as="select" custom value={serverName} onChange={handleChange}>
        {Object.values(SERVERS).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Form.Control>
    </InputGroup>
  );
};

export default ServerSelect;
