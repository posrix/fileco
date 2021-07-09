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
  lock: {
    viewBox: '0 0 1024 1024',
    data: (
      <g>
        <path
          d="M810.666667 981.333333H213.333333a128 128 0 0 1-128-128v-298.666666a128 128 0 0 1 128-128h597.333334a128 128 0 0 1 128 128v298.666666a128 128 0 0 1-128 128zM213.333333 512a42.666667 42.666667 0 0 0-42.666666 42.666667v298.666666a42.666667 42.666667 0 0 0 42.666666 42.666667h597.333334a42.666667 42.666667 0 0 0 42.666666-42.666667v-298.666666a42.666667 42.666667 0 0 0-42.666666-42.666667z"
          p-id="1912"
        ></path>
        <path
          d="M725.333333 512a42.666667 42.666667 0 0 1-42.666666-42.666667V298.666667a170.666667 170.666667 0 0 0-341.333334 0v170.666666a42.666667 42.666667 0 0 1-85.333333 0V298.666667a256 256 0 0 1 512 0v170.666666a42.666667 42.666667 0 0 1-42.666667 42.666667z"
          p-id="1913"
        ></path>
      </g>
    ),
  },
  close: {
    viewBox: '0 0 1024 1024',
    data: (
      <g>
        <path
          d="M510.34 447.586l219.134-219.254c17.57-17.58 46.06-17.586 63.64-0.02 17.58 17.57 17.586 46.064 0.018 63.64L573.98 511.228l219.352 219.352c17.574 17.572 17.574 46.066 0 63.64-17.574 17.572-46.066 17.572-63.64 0L510.358 574.882 291.224 794.138c-17.568 17.58-46.06 17.586-63.64 0.018-17.578-17.568-17.586-46.06-0.016-63.64l219.15-219.272-217.82-217.82c-17.574-17.574-17.574-46.068 0-63.64 17.574-17.574 46.066-17.574 63.64 0L510.34 447.586z"
          p-id="2553"
        ></path>
      </g>
    ),
  },
};

type Glyphs = { [key in keyof typeof GlyphsBase]: IGlyph } & {
  [key: string]: IGlyph;
};
const glyphs: Glyphs = GlyphsBase;

export default glyphs;
