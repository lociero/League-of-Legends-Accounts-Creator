import React from 'react';
import { connect } from 'react-redux';

// import saveAccs from './write';
import '@fortawesome/fontawesome-free/css/all.min.css';
import OutputResult from './OutputResult.jsx';
import FooterButton from './FooterButton.jsx';
import TabContent from './TabContent.jsx';
import NavTabs from './NavTabs.jsx';
import ProgressBar from './ProgressBar.jsx';

// const mapStateToProps = state => {
//   const { apiKey, serverName, emailMask, amount, dateOfBirth } = state;
//   return { apiKey, serverName, emailMask, amount, dateOfBirth };
// };

// const actionCreators = {
//   update2Captcha: actions.update2Captcha,
//   addTask: actions.addTask,
// };
// const googleKey = '6Lc3HAsUAAAAACsN7CgY9MMVxo2M09n_e4heJEiZ';

const App = () => (
  <div>
    {/* <h1 className="display-4 text-center">
        League of Legends Accounts Creator
      </h1> */}
    <hr style={{ backgroundColor: '#4E5D6C', marginBottom: '-1px' }} />
    <NavTabs />
    <TabContent />
    <OutputResult />
    <ProgressBar />
    <FooterButton />
  </div>
);

export default connect(null, null)(App);
