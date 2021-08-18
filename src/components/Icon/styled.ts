import styled from 'styled-components';

export const InlineSvg = styled.svg<any>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: ${(props) => (props.color ? props.color : 'unset')};
  fill: currentColor;
`;

interface SvgWrapperProps {
  height?: number;
  width?: number;
  count?: number;
  hide?: boolean;
}

export const SvgWrapper = styled.div<SvgWrapperProps>`
  display: inline-block;
  width: ${(props) => (props.width ? `${props.width}px` : '30px')};
  height: ${(props) => (props.height ? `${props.height}px` : '30px')};
  position: relative;
  cursor: pointer;
  visibility: ${(props) => (props.hide ? 'hidden' : 'visible')};
`;
