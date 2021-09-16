import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import CommonPageHeader from 'src/components/CommonPageHeader';
import CommonPageFooter from 'src/components/CommonPageFooter';
import Icon from 'src/components/Icon';
import { RootState } from 'src/models/store';
import { useSelector } from 'react-redux';
import QRCode from 'react-qr-code';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Alert from 'src/components/Alert';
import {
  Container,
  QrCodeContainer,
  FieldTitle,
  CopyAddress,
  CopyIconContianer,
  CopyAddressContianer,
} from './styled';

const Receive: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const address = useSelector(
    (state: RootState) =>
      state.app.accounts[state.app.selectedAccountId].address
  );

  return (
    <Container>
      <CommonPageHeader titleLocaleId="global.receive" gutter={20} />
      <FieldTitle>
        <FormattedMessage id="receive.qrcode" />
      </FieldTitle>
      <QrCodeContainer>
        <QRCode value={address} size={120} />
      </QrCodeContainer>
      <FieldTitle>
        <FormattedMessage id="receive.address" />
      </FieldTitle>
      <CopyAddressContianer>
        <CopyAddress>{address}</CopyAddress>
        <CopyIconContianer>
          <CopyToClipboard text={address} onCopy={() => setCopied(true)}>
            <Icon glyph="copy" size={22} />
          </CopyToClipboard>
        </CopyIconContianer>
      </CopyAddressContianer>
      <CommonPageFooter onlyBack />
      <Alert
        open={copied}
        setOpen={setCopied}
        autoHideDuration={1000}
        textLocalId="global.copied"
      />
    </Container>
  );
};

export default Receive;
