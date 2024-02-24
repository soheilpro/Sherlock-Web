import * as React from 'react';
import { IFolder } from '../../../core';

interface IFolderEditProps {
  folder: IFolder;
  onAccept(folder: { name: string; }): void;
  onCancel(): void;
}

export function FolderEdit(props: IFolderEditProps): JSX.Element {
  const [ name, set_name ] = React.useState(props.folder.name);

  function handleNameFocus(event: React.FocusEvent<HTMLInputElement>): void {
    event.target.select();
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    set_name(event.target.value);
  }

  function handleFormSubmit(event: React.FormEvent): void {
    event.preventDefault();

    props.onAccept({
      name: name,
    });
  }

  function handleFormKeyDown(event: React.KeyboardEvent): void {
    if (event.key === 'Escape')
      props.onCancel();
  }

  function handleCancelButtonClick(): void {
    props.onCancel();
  }

  return (
    <form onSubmit={ handleFormSubmit } onKeyDown={ handleFormKeyDown }>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <input value={ name } autoFocus={ true } className="input-text-compact" onFocus={ handleNameFocus } onChange={ handleNameChange } />
        </div>
        <div className="flex flex-row justify-end gap-x-2">
          <button type="button" className="button-secondary" onClick={ handleCancelButtonClick }>Cancel</button>
          <button type="submit" className="button-primary">Save</button>
        </div>
      </div>
    </form>
  );
}
