import * as React from 'react';
import { ISvgImageProps } from '../base/svg';

export function FolderFillIcon(props: ISvgImageProps): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={ props.className } style={ props.style }>
      <g>
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M22 8v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7h19a1 1 0 0 1 1 1zm-9.586-3H2V4a1 1 0 0 1 1-1h7.414l2 2z"/>
      </g>
    </svg>
  );
}
