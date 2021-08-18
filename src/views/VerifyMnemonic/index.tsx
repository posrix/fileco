import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import CommonPageHeader from 'src/components/CommonPageHeader';
import Icon from 'src/components/Icon';
import { useHistory } from 'react-router-dom';
import CommonPageFooter from 'src/components/CommonPageFooter';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { getLocalStorage, setLocalStorage } from 'src/utils/app';
import { Dispatch } from 'src/models/store';
import { useDispatch } from 'react-redux';
import { shuffle } from 'lodash';
import {
  Container,
  WordButton,
  SortedWordButton,
  WordsContainer,
  SortedWordsContainer,
} from './styled';

const passworder = require('browser-passworder');

const VerifyMnemonic: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch<Dispatch>();

  const password = getLocalStorage('password');
  const mnemonic = getLocalStorage('temporary-mnemonic');

  const [words, setWords] = useState(shuffle(mnemonic.split(' ')));
  const [sortedwords, setSortedWords] = useState([]);
  const [showError, setShowError] = React.useState(false);

  const handleConfirm = () => {
    if (sortedwords.length) {
      const matchedOrder = sortedwords.join(' ') === mnemonic;
      if (matchedOrder) {
        window.localStorage.clear();
        passworder.encrypt(password, mnemonic).then(async (blob: any) => {
          setLocalStorage('mnemonic', blob);
          await dispatch.app.createAccount({
            password,
          });
          history.push('/home');
        });
      } else {
        setShowError(true);
      }
    }
  };

  return (
    <Container>
      <CommonPageHeader
        titleLocaleId="mnemonic.verify.title"
        subtitleLocaleId="mnemonic.verify.subtitle"
      />
      <SortedWordsContainer hasWords={!!sortedwords.length}>
        {sortedwords.map((word, i) => (
          <SortedWordButton
            key={i}
            onClick={() => {
              const splicedWord = sortedwords.splice(i, 1)[0];
              setSortedWords(sortedwords.slice());
              setWords([...words, splicedWord]);
            }}
          >
            {word}
            <Icon glyph="close" size={14} />
          </SortedWordButton>
        ))}
      </SortedWordsContainer>
      <WordsContainer>
        {words.map((word, i) => (
          <WordButton
            key={i}
            onClick={() => {
              const splicedWord = words.splice(i, 1)[0];
              setWords(words.slice());
              setSortedWords([...sortedwords, splicedWord]);
            }}
          >
            {word}
          </WordButton>
        ))}
      </WordsContainer>
      <CommonPageFooter onConfirm={handleConfirm} />
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={showError}
        autoHideDuration={3000}
        onClose={(_, reason) => {
          if (reason === 'clickaway') {
            return;
          }
          setShowError(false);
        }}
      >
        <Alert severity="error">
          <FormattedMessage id="mnemonic.verify.wrong.order" />
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VerifyMnemonic;
