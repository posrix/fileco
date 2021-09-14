export const LOTUS_RPC_ENDPOINT = {
  CALIBRATION: `http://192.168.1.233:1301/rpc/v0`,
  MAINNET: `http://192.168.1.233:1234/rpc/v0`,
};

export const LOTUS_AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.KTfmCTjHOK0AR3HRhnu1D5jrDYTcDDmeGxZk8CHdTfk';

export const DEV_PASSWORD = '12345678';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
