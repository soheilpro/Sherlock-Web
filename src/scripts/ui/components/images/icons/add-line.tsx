import * as React from 'react';
import { ISvgImageProps } from '../base/svg';

export function AddLineIcon(props: ISvgImageProps): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={ props.className } style={ props.style }>
      <g>
        <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
      </g>
    </svg>
  );
}
