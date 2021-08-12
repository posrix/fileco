import { store } from 'src/models/store';
import { Network } from 'src/types/app';
import axios, { AxiosRequestConfig } from 'axios';

const mainnetURL = 'https://api.filscout.com/api/';
const calibrationURL = 'https://calibration-api.filscout.com/api/';

const axioisRequest = axios.create({
  timeout: 1000,
});

export default function request(
  url: string,
  baseUrl: string,
  options: AxiosRequestConfig
) {
  return axioisRequest(`${baseUrl}${url}`, options)
    .then((response) => {
      const {
        data: { code, data },
      } = response;
      if (code !== 200 && code !== 201) {
        return Promise.reject({ response });
      }
      return Promise.resolve(data);
    })
    .catch(({ response }) => {
      return Promise.reject(response);
    });
}

const switchNetworkUrl = (network: Network) =>
  network === Network.Calibration ? calibrationURL : mainnetURL;

export const getMessagesByAddress = ({
  address,
}: {
  address: string;
}): Promise<any> => {
  return request(
    '/v1/message',
    switchNetworkUrl(store.getState().app.selectedNetwork),
    {
      method: 'post',
      data: {
        address,
        blockCid: '',
        idAddress: '',
        method: '',
        pageIndex: 1,
        pageSize: 20,
        timeEnd: 0,
        timeStart: 0,
      },
    }
  );
};
