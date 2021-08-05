import React from 'react';
import { FormattedMessage } from 'react-intl';
import Header from 'src/views/Header';
import CommonPageHeader from 'src/components/CommonPageHeader';
import CommonPageFooter from 'src/components/CommonPageFooter';
import Icon from 'src/components/Icon';
import { RootState } from 'src/models/store';
import { useSelector } from 'react-redux';
import QRCode from 'react-qr-code';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Container,
  QrCodeContainer,
  FieldTitle,
  CopyAddress,
  CopyIconContianer,
  CopyAddressContianer,
} from './styled';

const Receive: React.FC = () => {
  const address = useSelector((state: RootState) => state.app.address);

  return (
    <>
      <Header />
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
          <CopyAddress>{address} </CopyAddress>
          <CopyIconContianer>
            <CopyToClipboard text={address}>
              <Icon glyph="copy" size={22} />
            </CopyToClipboard>
          </CopyIconContianer>
        </CopyAddressContianer>
        <CommonPageFooter onlyBack />
      </Container>
    </>
  );
};

export default Receive;
