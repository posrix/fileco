import React from 'react';
import glyphs from './glyphs';
import { InlineSvg, SvgWrapper } from './styled';

interface Props {
  glyph: string;
  size?: number;
  height?: number;
  width?: number;
  count?: number;
  color?: string;
  onClick?(): void;
}

class Icon extends React.Component<Props> {
  render() {
    const { size, count, color, glyph, onClick, ...rest } = this.props;
    let { height, width } = this.props;
    if (!size) {
      height = 30;
      width = 30;
    } else {
      height = size;
      width = size;
    }
    return (
      <SvgWrapper width={width} height={height} count={count} onClick={onClick} {...rest}>
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
          fit
        >
          {glyphs[glyph].data}
        </InlineSvg>
      </SvgWrapper>
    );
  }
}

export default Icon;
