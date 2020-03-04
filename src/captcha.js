import Client from '@infosimples/node_two_captcha';

const decodingCaptha = async (googlekey, apiKey, url) => {
  const client = new Client(apiKey, {
    timeout: 200000,
    polling: 5000,
    throwErrors: false,
  });
  const response = await client.decodeRecaptchaV2({
    googlekey,
    pageurl: url,
  });
  return response;
};

export default decodingCaptha;
