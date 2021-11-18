/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { sleep, random } from '../../../utils/utils.js';

export default async ({ captchaCancelToken }) => {
  const client = axios.create({
    cancelToken: captchaCancelToken.token,
    validateStatus: false,
  });
  await sleep(random(5000, 10000));
  await client.get('https://api.ipify.org?format=json').then((res) => res.data);
  return `eyJ`;
};
