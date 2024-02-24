import * as React from 'react';
import { IFile } from '../../../core';
import { File } from '../file';

interface IFileListProps {
  files: IFile[];
  onSelect(file: IFile): void;
  onCancel(): void;
}

export function FileList(props: IFileListProps): JSX.Element {
  return (
    <div className="flex flex-col items-center">
      <div className="h-12"></div>
      <h1 className="font-bold text-3xl text-center">Database</h1>
      <div className="h-12"></div>
      <div className="min-w-64 grid gap-5">
        {
          sortFiles(props.files).map(file => (
            <File file={ file } onSelect={ () => props.onSelect(file) } key={ file.name } />
          ))
        }
        <div></div>
        <button className="button-link justify-self-center" onClick={ props.onCancel }>Cancel</button>
      </div>
    </div>
  );
}

function sortFiles(files: IFile[]): IFile[] {
  files = [ ...files ];
  files.sort((file1, file2) => file1.name.localeCompare(file2.name));

  return files;
}
