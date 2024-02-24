import * as React from 'react';
import { ISvgImageProps } from '../base/svg';

export function FolderOpenFillIcon(props: ISvgImageProps): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={ props.className } style={ props.style }>
      <g>
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M3 21a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2H20a1 1 0 0 1 1 1v3H4v9.996L6 11h16.5l-2.31 9.243a1 1 0 0 1-.97.757H3z"/>
      </g>
    </svg>
  );
}
