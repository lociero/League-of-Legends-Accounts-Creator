import { createAction } from 'redux-actions';

export const update2Captcha = createAction('2CAPTCHA_KEY_UPDATE');
export const updateServer = createAction('SERVER_UPDATE');
export const updateEmail = createAction('EMAIL_UPDATE');
export const updateAmount = createAction('AMOUNT_UPDATE');
export const updateDateOfBirth = createAction('DATE_OF_BIRTH_UPDATE');
export const updateOutputResults = createAction('OUTPUT_RESULTS_UPDATE');
export const toggleGenerate = createAction('TOGGLE_GENERATE');
export const tickTimer = createAction('TIMER_TICK');
export const resetTimer = createAction('TIMER_RESET');
export const toggleEmailCheckBox = createAction('TOGGLE_EMAIL_CHECKBOX');
