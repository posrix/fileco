import axios, { AxiosRequestConfig } from 'axios';

const axioisRequest = axios.create({
  timeout: 1000,
  baseURL: 'https://pro-api.coinmarketcap.com',
});

export default function request(url: string, options: AxiosRequestConfig) {
  return axioisRequest(url, options)
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch(({ response }) => {
      return Promise.reject(response);
    });
}

export const getFILPrice = ({ symbol = 'FIL' }: { symbol: string }) => {
  return request('/v1/cryptocurrency/listings/latest', {
    method: 'get',
    params: {
      symbol,
    },
  });
};
