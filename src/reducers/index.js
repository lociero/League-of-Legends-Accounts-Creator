import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions/index';

const data = handleActions(
  {
    [actions.update2Captcha](state, { payload }) {
      return { ...state, twoCaptchaApiKey: payload.value };
    },
    [actions.updateAntiCaptcha](state, { payload }) {
      return { ...state, antiCaptchaApiKey: payload.value };
    },
    [actions.updateRuCaptcha](state, { payload }) {
      return { ...state, ruCaptchaApiKey: payload.value };
    },
    [actions.updateDbcUsername](state, { payload }) {
      return { ...state, dbcUsername: payload.value };
    },
    [actions.updateDbcPassword](state, { payload }) {
      return { ...state, dbcPassword: payload.value };
    },
    [actions.apiServiceUpdate](state, { payload }) {
      return { ...state, currCaptcha: payload.value };
    },
    [actions.updateServer](state, { payload }) {
      return { ...state, serverName: payload.value };
    },
    [actions.updateEmail](state, { payload }) {
      return { ...state, emailMask: payload.value };
    },
    [actions.updateAmount](state, { payload }) {
      return { ...state, amount: payload.value };
    },
    [actions.updateDateOfBirth](state, { payload }) {
      return { ...state, dateOfBirth: payload.value };
    },
    [actions.updateOutputResults](state, { payload }) {
      return { ...state, outputResults: payload.value };
    },
    [actions.toggleEmailCheckBox](state, { payload }) {
      return { ...state, isRandomEmail: payload.value };
    },
    [actions.toggleExistedEmails](state, { payload }) {
      return { ...state, useExistedEmails: payload.value };
    },
    [actions.updatePasswordLength](state, { payload }) {
      return { ...state, passwordLength: payload.value };
    },
    [actions.generatePassword](state, { payload }) {
      return { ...state, passwordCheck: payload.value };
    },
    [actions.updateUsernameMinLength](state, { payload }) {
      return { ...state, usernameMinLength: payload.value };
    },
    [actions.updateUsernameMaxLength](state, { payload }) {
      return { ...state, usernameMaxLength: payload.value };
    },
    [actions.generateUsername](state, { payload }) {
      return { ...state, usernameCheck: payload.value };
    },
    [actions.toggleProxyUse](state) {
      return { ...state, useProxy: !state.useProxy };
    },
    [actions.updateProxyList](state, { payload }) {
      return { ...state, proxyList: payload.value };
    },
    [actions.updateProxyChecking](state, { payload }) {
      return { ...state, isProxyChecking: payload.value };
    },
    [actions.updateProxyGettingState](state, { payload }) {
      return { ...state, isGettingProxy: payload.value };
    },
    [actions.updateProxyCountry](state, { payload }) {
      return { ...state, proxyCountry: payload.value };
    },
  },
  {
    twoCaptchaApiKey: '',
    ruCaptchaApiKey: '',
    antiCaptchaApiKey: '',
    dbcUsername: '',
    dbcPassword: '',
    currCaptcha: '2Captcha',
    serverName: 'EUW',
    emailMask: '-xd@rito.plz',
    amount: '10',
    dateOfBirth: '2000-01-01',
    outputResults: '',
    isRandomEmail: false,
    useExistedEmails: false,
    useProxy: false,
    passwordLength: 10,
    passwordCheck: '',
    usernameMinLength: '8',
    usernameMaxLength: '12',
    usernameCheck: '',
    proxyList: '',
    isProxyChecking: false,
    isGettingProxy: false,
    proxyCountry: 'all',
  },
);

const isGenerating = handleActions(
  {
    [actions.toggleGenerate](state) {
      return !state;
    },
  },
  false,
);

const timer = handleActions(
  {
    [actions.tickTimer](state) {
      return state - 1;
    },
    [actions.resetTimer]() {
      return 500;
    },
  },
  500,
);

const progressBarPercentage = handleActions(
  {
    [actions.updateProgressBar](state, { payload }) {
      return payload.value;
    },
  },
  0,
);

export default combineReducers({
  data,
  isGenerating,
  timer,
  progressBarPercentage,
});
