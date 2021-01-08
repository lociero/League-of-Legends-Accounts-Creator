import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import useGlobalState from '../state.js';
import { STATE_NAMES } from '../constants.js';

const NumberOfAccounts = () => {
  const [amount, updateAmount] = useGlobalState(STATE_NAMES.AMOUNT);

  const handleChange = (e) => {
    if (+e.target.value > 2000) {
      updateAmount(2000);
      return;
    }
    updateAmount(e.target.value);
  };

  return (
    <>
      <InputGroup className="col-2 p-1">
        <InputGroup.Prepend>
          <InputGroup.Text id="amountOfAccounts">AMOUNT</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          type="number"
          placeholder="10"
          min="1"
          max="2000"
          aria-label="amountOfAccounts"
          onChange={handleChange}
          value={amount}
        />
      </InputGroup>
    </>
  );
};

export default NumberOfAccounts;
