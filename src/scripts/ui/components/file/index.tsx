import * as React from 'react';
import { IFile } from '../../../core';

interface IFileProps {
  file: IFile;
  onSelect(): void;
}

export function File(props: IFileProps): JSX.Element {
  return (
    <button className="button-secondary" onClick={ props.onSelect }>{ props.file.name }</button>
  );
}
