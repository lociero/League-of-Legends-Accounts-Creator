import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions/index';

const apiKey = handleActions(
  {
    [actions.update2Captcha](state, { payload }) {
      return payload.value;
    },
  },
  '',
);

const serverName = handleActions(
  {
    [actions.updateServer](state, { payload }) {
      return payload.value;
    },
  },
  'EUW',
);

const emailMask = handleActions(
  {
    [actions.updateEmail](state, { payload }) {
      return payload.value;
    },
  },
  '@rito.pls',
);

const amount = handleActions(
  {
    [actions.updateAmount](state, { payload }) {
      return payload.value;
    },
  },
  '10',
);

const dateOfBirth = handleActions(
  {
    [actions.updateDateOfBirth](state, { payload }) {
      return payload.value;
    },
  },
  '2000-01-01',
);

const outputResults = handleActions(
  {
    [actions.updateOutputResults](state, { payload }) {
      return payload.value;
    },
  },
  '',
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

const isCheckedEmail = handleActions(
  {
    [actions.toggleEmailCheckBox](state) {
      return !state;
    },
  },
  false,
);
export default combineReducers({
  apiKey,
  serverName,
  emailMask,
  amount,
  dateOfBirth,
  outputResults,
  isGenerating,
  timer,
  isCheckedEmail,
});
