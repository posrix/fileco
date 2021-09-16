import styled from 'styled-components';
import { IconProps } from './';

export const InlineSvg = styled.svg<Pick<IconProps, 'color'>>`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  color: ${(props) => (props.color ? props.color : 'unset')};
  fill: currentColor;
`;

interface SvgWrapperProps
  extends Pick<IconProps, 'height' | 'width' | 'hide'> {}

export const SvgWrapper = styled.div<SvgWrapperProps>`
  display: inline-block;
  width: ${(props) => (props.width ? `${props.width}px` : '30px')};
  height: ${(props) => (props.height ? `${props.height}px` : '30px')};
  position: relative;
  cursor: pointer;
  visibility: ${(props) => (props.hide ? 'hidden' : 'visible')};
`;
