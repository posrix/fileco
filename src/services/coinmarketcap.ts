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

export const getCoinPriceList = ({  }: {  }) => {
  return request('/v1/cryptocurrency/listings/latest', {
    method: 'get',
    params: {

    },
    headers: {
      'X-CMC_PRO_API_KEY': '144854fa-b1a0-455e-ba79-c6ce777616ed',
    },
  });
};
