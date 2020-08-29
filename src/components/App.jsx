import React from 'react';
import { connect } from 'react-redux';
import '@fortawesome/fontawesome-free/css/all.min.css';
import OutputResult from './OutputResult.jsx';
import FooterButton from './FooterButton.jsx';
import TabContent from './TabContent.jsx';
import NavTabs from './NavTabs.jsx';
import ProgressBar from './ProgressBar.jsx';

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
