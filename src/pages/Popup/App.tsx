import * as React from 'react';
import SetPassword from 'src/views/SetPassword';
import Welcome from 'src/views/Welcome';
import ProduceMnemonic from 'src/views/ProduceMnemonic';
import VerifyMnemonic from 'src/views/VerifyMnemonic';
import Demo from 'src/views/Demo';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { getLocalStorage } from 'src/utils/app';
import { localeMessages } from 'src/locales';
import { Language } from 'src/types/app';
import { IntlProvider } from 'react-intl';
import { StylesProvider } from '@material-ui/core/styles';

export default function App() {
  const locale = (getLocalStorage('locale') as Language) || Language.zh;

  return (
    <IntlProvider messages={localeMessages[locale]} locale={locale}>
      <StylesProvider injectFirst>
        <HashRouter hashType="noslash">
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route exact path="/set-password" component={SetPassword} />
            <Route exact path="/mnemonic" component={ProduceMnemonic} />
            <Route exact path="/verify-mnemonic" component={VerifyMnemonic} />
            <Route path="/demo" component={Demo} />
          </Switch>
        </HashRouter>
      </StylesProvider>
    </IntlProvider>
  );
}
