import React from 'react';
import glyphs from './glyphs';
import { InlineSvg, SvgWrapper } from './styled';

export interface IconProps {
  glyph: string;
  size?: number;
  height?: number;
  width?: number;
  color?: string;
  hide?: boolean;
  onClick?(): void;
}

class Icon extends React.Component<IconProps> {
  render() {
    const {
      size,
      color = '#757575',
      glyph,
      hide = false,
      onClick,
      ...rest
    } = this.props;
    let { height, width } = this.props;
    if (!size) {
      height = 30;
      width = 30;
    } else {
      height = size;
      width = size;
    }
    return (
      <SvgWrapper
        width={width}
        height={height}
        hide={hide}
        onClick={onClick}
        {...rest}
      >
        <InlineSvg
          color={color}
          fillRule="evenodd"
          clipRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="1.414"
          xmlns="http://www.w3.org/2000/svg"
          aria-labelledby="title"
          viewBox={glyphs[glyph].viewBox}
          preserveAspectRatio="xMidYMid meet"
        >
          {glyphs[glyph].data}
        </InlineSvg>
      </SvgWrapper>
    );
  }
}

export default Icon;
