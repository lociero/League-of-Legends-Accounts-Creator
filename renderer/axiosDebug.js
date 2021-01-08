import axios from 'axios';

const getTime = () => {
  const today = new Date();
  const hours = `${today.getHours()}`.padStart(2, '0');
  const minutes = `${today.getMinutes()}`.padStart(2, '0');
  const seconds = `${today.getSeconds()}`.padStart(2, '0');
  const time = `${hours}:${minutes}:${seconds}`;
  return time;
};

export default () => {
  axios.interceptors.request.use((request) => {
    const { method, url } = request;
    console.log(getTime(), 'axios', method, url);
    return request;
  });

  axios.interceptors.response.use((response) => {
    const { status, config } = response;
    console.log(getTime(), 'axios', status, config.url);
    return response;
  });
};
