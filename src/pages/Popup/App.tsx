import * as React from 'react';
import SetPassword from 'src/views/SetPassword';
import Welcome from 'src/views/Welcome';
import ProduceMnemonic from 'src/views/ProduceMnemonic';
import VerifyMnemonic from 'src/views/VerifyMnemonic';
import Home from 'src/views/Home';
import Transfer from 'src/views/Transfer';
import Unlock from 'src/views/Unlock';
import Message from 'src/views/Message';
import Receive from 'src/views/Receive';
import Setting from 'src/views/Setting';
import ViewMnemonic from 'src/views/Setting/ViewMnemonic';
import About from 'src/views/Setting/About';
import ImportAccount from 'src/views/ImportAccount';
import { RootState, store } from 'src/models/store';
import { getPersistor } from '@rematch/persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  HashRouter,
  Route,
  Switch,
  Redirect,
  RouteProps,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getLocalStorage, LotusRPCAdaptor } from 'src/utils/app';
import { localeMessages } from 'src/locales';
import { Language, Network } from 'src/types/app';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { StylesProvider } from '@material-ui/core/styles';

const InitializedRoute: React.FC<RouteProps> = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props: any) =>
        !getLocalStorage('mnemonic') ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/home', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

const UnlockedRoute: React.FC<RouteProps> = ({
  component: Component,
  ...rest
}) => {
  const account = useSelector(
    (state: RootState) => state.app.accounts[state.app.selectedAccountId]
  );
  const hasExtendedKey = account ? !isEmpty(account.extendedKey) : false;
  return (
    <Route
      {...rest}
      render={(props: any) =>
        hasExtendedKey ? (
          <Component {...props} />
        ) : (
          <Redirect
            push
            to={{ pathname: '/unlock', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

export default function App() {
  const locale = (getLocalStorage('locale') as Language) || Language.zh;

  new LotusRPCAdaptor(Network.Calibration);
  new LotusRPCAdaptor(Network.Mainnet);

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider messages={localeMessages[locale]} locale={locale}>
        <StylesProvider injectFirst>
          <Provider store={store}>
            <PersistGate persistor={getPersistor()}>
              <HashRouter hashType="noslash">
                <Switch>
                  <InitializedRoute exact path="/" component={Welcome} />
                  <InitializedRoute
                    exact
                    path="/set-password"
                    component={SetPassword}
                  />
                  <InitializedRoute
                    exact
                    path="/import-account"
                    component={ImportAccount}
                  />
                  <InitializedRoute
                    exact
                    path="/mnemonic"
                    component={ProduceMnemonic}
                  />
                  <InitializedRoute
                    exact
                    path="/verify-mnemonic"
                    component={VerifyMnemonic}
                  />
                  <UnlockedRoute exact path="/home" component={Home} />
                  <UnlockedRoute exact path="/transfer" component={Transfer} />
                  <UnlockedRoute exact path="/setting" component={Setting} />
                  <UnlockedRoute
                    exact
                    path="/setting/about"
                    component={About}
                  />
                  <UnlockedRoute
                    exact
                    path="/setting/view-mnemonic"
                    component={ViewMnemonic}
                  />
                  <UnlockedRoute exact path="/receive" component={Receive} />
                  <UnlockedRoute path="/message/:cid" component={Message} />
                  <Route exact path="/unlock" component={Unlock} />
                </Switch>
              </HashRouter>
            </PersistGate>
          </Provider>
        </StylesProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
}
