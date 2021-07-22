import React, { useEffect } from 'react';
import { Dispatch } from 'src/models/store';
import { RootState } from 'src/models/store';
import { WrappedLotusRPC } from 'src/utils/app';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  getLocalStorage,
  getExtendedKeyBySeed,
  getAddressByNetwork,
} from 'src/utils/app';

interface UnlockProps {
  location: any;
}
const Unlock: React.FC<UnlockProps> = ({ location }) => {
  const history = useHistory();
  const selectedNetwork = useSelector(
    (state: RootState) => state.app.selectedNetwork
  );
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    getExtendedKeyBySeed(getLocalStorage('password')).then((extendedKey) => {
      dispatch.app.setAddress(
        getAddressByNetwork(selectedNetwork, extendedKey.address)
      );
      dispatch.app.setExtendedKey(extendedKey);
      new WrappedLotusRPC(selectedNetwork, true);
      history.replace(location.state.from.pathname);
    });
  }, []);

  // TODO use user real input password to decrypt seed
  return <></>;
};

export default Unlock;
