import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ActionHeader from 'src/components/ActionHeader';
import Icon from 'src/components/Icon';
import { useHistory } from 'react-router-dom';
import ActionFooter from 'src/components/ActionFooter';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { getLocalStorage, setLocalStorage } from 'src/utils/app';
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

  const password = getLocalStorage('password');
  const mnemonic = getLocalStorage('mnemonic');

  const [words, setWords] = useState(mnemonic.split(' '));
  const [sortedwords, setSortedWords] = useState([]);
  const [showError, setShowError] = React.useState(false);

  const handleConfirm = () => {
    const matchedOrder = sortedwords.join(' ') === mnemonic;
    if (matchedOrder) {
      window.localStorage.clear();
      passworder.encrypt(password, mnemonic).then(function (blob: any) {
        setLocalStorage('mnemonic', blob);
        setLocalStorage('password', password);
      });
      history.push('/home');
    } else if (words.length) {
      return;
    } else {
      setShowError(true);
    }
  };

  return (
    <Container>
      <ActionHeader
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
      <ActionFooter onConfirm={handleConfirm} />
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
