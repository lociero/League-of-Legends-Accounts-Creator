import axios from 'axios';
import { getAgent, sleep } from '../../utils/utils.js';

const getCookies = (response) => {
  const { headers } = response;
  return (
    headers['set-cookie']
      .map((cookie) => {
        const [value] = cookie.split(';');
        return `${value};`;
      })
      // .filter((str) => str.includes('authenticator.sid'))
      .join(' ')
  );
};

export default async (userAgent, proxy) => {
  const cancelToken = axios.CancelToken.source();
  sleep(1 * 30 * 1000).then(() => cancelToken.cancel('RQDATA_REQUEST_TIMEOUT'));
  const client = axios.create({
    headers: {
      'User-Agent': userAgent,
    },
    httpsAgent: getAgent(proxy),
    cancelToken: cancelToken.token,
    validateStatus: false,
  });

  try {
    const firstStepUrl =
      'https://xsso.leagueoflegends.com/login?uri=https%3A%2F%2Fsignup.leagueoflegends.com&prompt=signup&show_region=true&locale=ru_RU';
    const firstResponse = await client.get(firstStepUrl, { maxRedirects: 0 });

    const secondStepUrl = firstResponse.headers.location;
    const secondResponse = await client.get(secondStepUrl, {
      maxRedirects: 0,
      headers: {
        cookie: getCookies(firstResponse),
      },
    });

    const thirdStepUrl = secondResponse.headers.location;
    const thirdResponse = await client.get(thirdStepUrl, {
      maxRedirects: 0,
      headers: {
        cookie: getCookies(secondResponse),
      },
    });

    const fourthStepUrl = `https://authenticate.riotgames.com${thirdResponse.headers.location}`;
    const fourthResponse = await client.get(fourthStepUrl, {
      maxRedirects: 0,
      headers: {
        cookie: getCookies(thirdResponse),
      },
    });

    const fifthStepUrl = 'https://authenticate.riotgames.com/api/v1/login';
    const fifthResponse = await client.get(fifthStepUrl, {
      headers: {
        cookie: getCookies(fourthResponse),
      },
    });

    const { data, key } = fifthResponse.data.captcha.hcaptcha;

    return {
      siteKey: key,
      rqdata: data,
      cookies: getCookies(fifthResponse),
    };
  } catch (thrown) {
    if (axios.isCancel(thrown)) {
      throw new Error(thrown.message);
    }
    throw new Error('RQDATA_REQUEST_FAILED');
  }
};
