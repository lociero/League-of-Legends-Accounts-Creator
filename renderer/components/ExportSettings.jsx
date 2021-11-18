/* eslint-disable no-template-curly-in-string */
import React from 'react';
import { Container, Button, Row, Col, InputGroup, FormControl, Alert } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
// import ReactTooltip from 'react-tooltip';
import useGlobalState from '../state.js';
import { STATE_NAMES } from '../../constants/constants.js';
import { getDate, getRandomBirth, parseTemplate } from '../../utils/utils.js';
import genName from '../../utils/nameGen.js';
import genPass from '../../utils/passwordGen.js';

const ExportSettings = () => {
  // const template = '${server}:${username}:${password}:${email}:${accountId}:${birth}:${creationDate} proxy: ${proxy}';
  const [customTemplate, setCustomTemplate] = useGlobalState(STATE_NAMES.CUSTOM_TEMPLATE);
  const [useCompact, setUseCompact] = useGlobalState(STATE_NAMES.USE_COMPACT);
  const [useFull, setUseFull] = useGlobalState(STATE_NAMES.USE_FULL);
  const [useCustom, setUseCustom] = useGlobalState(STATE_NAMES.USE_CUSTOM);

  const exampleAccount = React.useMemo(
    () => ({
      server: 'EUW',
      username: genName(7, 8),
      password: genPass(10),
      email: 'example@rito.pls',
      accountId: 1234567890,
      birth: getRandomBirth(),
      creationDate: getDate(),
      proxy: '123.123.123.123',
    }),
    []
  );

  const handleInputChange = (e) => {
    setCustomTemplate(e.target.value);
  };

  return (
    <Container fluid>
      <Alert variant="secondary">
        You can change the export format by creating your own template. Token should be inside ${'{}'} brackets. <br />
        Available tokens: server, username, password, email, accountId, birth, creationDate, proxy.
      </Alert>
      <Row>
        <Col xs={12}>
          <InputGroup className="my-2">
            <InputGroup.Prepend>
              <InputGroup.Text>COMPACT</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl disabled value={parseTemplate({ type: 'compact' }, exampleAccount)} />
            <InputGroup.Append>
              <Button
                onClick={() => setUseCompact((prev) => !prev)}
                variant={useCompact ? 'outline-success' : 'outline-danger'}
              >
                {useCompact ? 'ON' : 'OFF'}
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <InputGroup className="my-2">
            <InputGroup.Prepend>
              <InputGroup.Text>FULL</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl disabled value={parseTemplate({ type: 'full' }, exampleAccount)} />
            <InputGroup.Append>
              <Button
                onClick={() => setUseFull((prev) => !prev)}
                variant={useFull ? 'outline-success' : 'outline-danger'}
              >
                {useFull ? 'ON' : 'OFF'}
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <InputGroup className="my-2">
            <InputGroup.Prepend>
              <InputGroup.Text>CUSTOM</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl disabled value={parseTemplate({ template: customTemplate }, exampleAccount)} />
            <InputGroup.Append>
              <Button
                onClick={() => setUseCustom((prev) => !prev)}
                variant={useCustom ? 'outline-success' : 'outline-danger'}
              >
                {useCustom ? 'ON' : 'OFF'}
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <InputGroup className="mb-5">
            <InputGroup.Prepend>
              <InputGroup.Text>TEMPLATE</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl spellCheck={false} value={customTemplate} onChange={handleInputChange} />
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default ExportSettings;
