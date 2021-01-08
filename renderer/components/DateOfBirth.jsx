import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import useGlobalState from '../state.js';
import { DATE_OF_BIRTH_TYPES, STATE_NAMES } from '../constants.js';

const DateOfBirth = () => {
  const [birth, updateBirth] = useGlobalState(STATE_NAMES.BIRTH);
  const [birthType, updateBirthType] = useGlobalState(STATE_NAMES.BIRTH_TYPE);

  const handleChange = (e) => {
    updateBirth(e.target.value);
  };
  const handleBirthTypeChange = (e) => {
    updateBirthType(e.target.value);
  };

  return (
    <>
      <InputGroup className="col-4 p-1">
        <InputGroup.Prepend>
          <InputGroup.Text id="dateOfBirth">DATE OF BIRTH</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          hidden={birthType === DATE_OF_BIRTH_TYPES.RANDOM}
          placeholder="YYYY-MM-DD"
          aria-label="dateOfBirth"
          onChange={handleChange}
          value={birth}
        />
        <Form.Control as="select" custom value={birthType} onChange={handleBirthTypeChange}>
          {Object.values(DATE_OF_BIRTH_TYPES).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Form.Control>
      </InputGroup>
    </>
  );
};

export default DateOfBirth;
