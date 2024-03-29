import * as React from 'react';
import { ISvgImageProps } from '../base/svg';

export function DriveFillIcon(props: ISvgImageProps): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={ props.className } style={ props.style }>
      <g>
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M7.94 4.146l3.482 6.03-5.94 10.293L2 14.44 7.94 4.146zm2.176 10.294H22l-3.482 6.029H6.635l3.481-6.029zm4.343-1L8.518 3.145h6.964l5.94 10.295H14.46z"/>
      </g>
    </svg>
  );
}
