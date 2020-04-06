import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions/index';

const data = handleActions(
  {
    [actions.update2Captcha](state, { payload }) {
      return { ...state, apiKey: payload.value };
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
    [actions.toggleEmailCheckBox](state) {
      return { ...state, isCheckedEmail: !state.isCheckedEmail };
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
  },
  {
    apiKey: '',
    serverName: 'EUW',
    emailMask: '@rito.plz',
    amount: '10',
    dateOfBirth: '2000-01-01',
    outputResults: '',
    isCheckedEmail: false,
    passwordLength: 10,
    passwordCheck: '',
    usernameMinLength: '8',
    usernameMaxLength: '12',
    usernameCheck: '',
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
      return 300;
    },
  },
  300,
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
