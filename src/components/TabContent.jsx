/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import NumberOfAccounts from './NumberOfAccounts.jsx';
import ServerSelect from './ServerSelect.jsx';
import EmailMask from './EmailMask.jsx';
import DateOfBirth from './DateOfBirth.jsx';
import Password from './Password.jsx';
import Username from './Username.jsx';
import CaptchaAPI from './CaptchaAPI.jsx';
import ProxySettings from './ProxySettings.jsx';

const TabContent = () => (
  <div className="tab-content" id="myTabContent">
    <div
      className="tab-pane fade show active"
      id="general"
      role="tabpanel"
      aria-labelledby="general-tab"
    >
      <div className="form-row">
        <ServerSelect />
        <NumberOfAccounts />
      </div>
      <div className="form-row">
        <EmailMask />
        <DateOfBirth />
      </div>
      <div className="form-row">
        <Username />
        <Password />
      </div>
    </div>
    <div className="tab-pane fade" id="captcha" role="tabpanel" aria-labelledby="captcha-tab">
      <div className="form-row">
        <CaptchaAPI />
      </div>
      <p className="text-info">More services will be added in the future.</p>
    </div>
    <div className="tab-pane fade" id="proxy" role="tabpanel" aria-labelledby="proxy-tab">
      <ProxySettings />
    </div>
  </div>
);

export default TabContent;
