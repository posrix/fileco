import React from 'react';

export interface IGlyph {
  viewBox: string;
  data: JSX.Element;
}

const GlyphsBase = {
  'add-wallet': {
    viewBox: '0 0 24 24',
    data: (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g>
          <polygon points="0 0 24 0 24 24 0 24"></polygon>
          <g transform="translate(2.000000, 4.000000)" fillRule="nonzero">
            <path
              d="M18,0 C19.11,0 20,0.89 20,2 L20,2 L20,8 L18,8 L18,7 L2,7 L2,14 L12,14 L12,16 L2,16 C0.89,16 0,15.11 0,14 L0,14 L0.01,2 C0.01,0.89 0.89,0 2,0 L2,0 Z M18,2 L2,2 L2,5 L18,5 L18,2 Z"
              fill="#212121"
            ></path>
            <polygon
              fill="#0075FF"
              points="14 14 16 14 16 16 18 16 18 14 20 14 20 12 18 12 18 10 16 10 16 12 14 12"
            ></polygon>
          </g>
        </g>
      </g>
    ),
  },
  'import-wallet': {
    viewBox: '0 0 24 24',
    data: (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g>
          <polygon points="0 0 24 0 24 24 0 24"></polygon>
          <path
            d="M11.34,15.02 C11.73,15.41 12.36,15.41 12.75,15.02 L19.11,8.66 C19.5,8.27 19.5,7.64 19.11,7.25 L14.16,2.3 C13.78,1.9 13.15,1.9 12.76,2.29 L6.39,8.66 C6,9.05 6,9.68 6.39,10.07 L11.34,15.02 Z M13.46,4.41 L17,7.95 L12.05,12.9 L8.51,9.36 L13.46,4.41 Z"
            fill="#0075FF"
            fillRule="nonzero"
          ></path>
          <path
            d="M6.83,13 L8.83,15 L6.78,15 L5,17 L19,17 L17.23,15 L15.32,15 L17.32,13 L18,13 L21,16 L21,20 C21,21.11 20.1,22 19,22 L19,22 L4.99,22 C3.89,22 3,21.1 3,20 L3,20 L3,16 L6,13 L6.83,13 Z M19,19 L5,19 L5,20 L19,20 L19,19 Z"
            fill="#212121"
            fillRule="nonzero"
          ></path>
        </g>
      </g>
    ),
  },
};

type Glyphs = { [key in keyof typeof GlyphsBase]: IGlyph } & {
  [key: string]: IGlyph;
};
const glyphs: Glyphs = GlyphsBase;

export default glyphs;
