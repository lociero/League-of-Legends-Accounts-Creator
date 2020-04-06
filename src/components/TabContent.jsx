/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import NumberOfAccounts from './NumberOfAccounts';
import ServerSelect from './ServerSelect';
import EmailMask from './EmailMask';
import DateOfBirth from './DateOfBirth';
import Password from './Password';
import Username from './Username';
import CaptchaAPI from './CaptchaAPI';

const TabContent = () => {
  return (
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
      <div
        className="tab-pane fade"
        id="captcha"
        role="tabpanel"
        aria-labelledby="captcha-tab"
      >
        <div className="form-row">
          <CaptchaAPI />
        </div>
        <p className="text-info">More services will be added in the future.</p>
      </div>
      <div
        className="tab-pane fade"
        id="proxy"
        role="tabpanel"
        aria-labelledby="proxy-tab"
      >
        <p className="text-danger" style={{ marginTop: '1rem' }}>
          Free proxies were super unstable during testing. Until I can guarantee
          their stability, proxy support is not enabled.
        </p>
        <p className="text-danger" style={{ marginTop: '1rem' }}>
          P.S.: I personally think that proxies do not really matter.
        </p>
      </div>
    </div>
  );
};

export default TabContent;
