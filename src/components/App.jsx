import React from 'react';
import { connect } from 'react-redux';

// import saveAccs from './write';
import '@fortawesome/fontawesome-free/css/all.min.css';
import CaptchaAPI from './CaptchaAPI';
import ServerSelect from './ServerSelect';
import EmailMask from './EmailMask';
import NumberOfAccounts from './NumberOfAccounts';
import DateOfBirth from './DateOfBirth';
import OutputResult from './OutputResult';
import FooterButton from './FooterButton';

// const mapStateToProps = state => {
//   const { apiKey, serverName, emailMask, amount, dateOfBirth } = state;
//   return { apiKey, serverName, emailMask, amount, dateOfBirth };
// };

// const actionCreators = {
//   update2Captcha: actions.update2Captcha,
//   addTask: actions.addTask,
// };
// const googleKey = '6Lc3HAsUAAAAACsN7CgY9MMVxo2M09n_e4heJEiZ';

const App = () => {
  return (
    <div>
      <h1 className="display-4" style={{ textAlign: 'center' }}>
        League of Legends Accounts Creator
      </h1>
      <hr />
      <div className="form-row">
        <CaptchaAPI />
        <ServerSelect />
      </div>
      <div className="form-row">
        <EmailMask />
        <NumberOfAccounts />
        <DateOfBirth />
      </div>
      <OutputResult />
      <FooterButton />
    </div>
  );
};

export default connect(null, null)(App);
