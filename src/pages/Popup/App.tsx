import * as React from 'react';
import SetPassword from 'src/views/SetPassword';
import Welcome from 'src/views/Welcome';
import ProduceMnemonic from 'src/views/ProduceMnemonic';
import VerifyMnemonic from 'src/views/VerifyMnemonic';
import Home from 'src/views/Home';
import Transfer from 'src/views/Transfer';
import Unlock from 'src/views/Unlock';
import Demo from 'src/views/Demo';
import { RootState } from 'src/models/store';
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
import { getLocalStorage } from 'src/utils/app';
import { localeMessages } from 'src/locales';
import { Language } from 'src/types/app';
import { IntlProvider } from 'react-intl';
import { store } from 'src/models/store';
import { Provider } from 'react-redux';
import { StylesProvider } from '@material-ui/core/styles';

const InitializeRoute: React.FC<RouteProps> = ({
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

const ProtectedRoute: React.FC<RouteProps> = ({
  component: Component,
  ...rest
}) => {
  const extendedKey = useSelector((state: RootState) => state.app.extendedKey);
  return (
    <Route
      {...rest}
      render={(props: any) =>
        !isEmpty(extendedKey) ? (
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
    },
  },
});

export default function App() {
  const locale = (getLocalStorage('locale') as Language) || Language.zh;

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider messages={localeMessages[locale]} locale={locale}>
        <StylesProvider injectFirst>
          <Provider store={store}>
            <HashRouter hashType="noslash">
              <Switch>
                <Route exact path="/" component={Welcome} />
                <Route exact path="/set-password" component={SetPassword} />
                <InitializeRoute
                  exact
                  path="/mnemonic"
                  component={ProduceMnemonic}
                />
                <InitializeRoute
                  exact
                  path="/verify-mnemonic"
                  component={VerifyMnemonic}
                />
                <ProtectedRoute exact path="/home" component={Home} />
                <ProtectedRoute exact path="/transfer" component={Transfer} />
                <Route exact path="/unlock" component={Unlock} />
                <Route path="/demo" component={Demo} />
              </Switch>
            </HashRouter>
          </Provider>
        </StylesProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
}
