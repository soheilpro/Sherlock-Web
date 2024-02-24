import classNames from 'classnames';
import * as React from 'react';
import { IItem } from '../../../core';
import { CheckLineIcon } from '../images/icons';

interface IItemEditProps {
  item: IItem;
  onAccept(folder: { name: string; value: string; is_secret: boolean; }): void;
  onCancel(): void;
}

export function ItemEdit(props: IItemEditProps): JSX.Element {
  const [ name, set_name ] = React.useState(props.item.name);
  const [ value, set_value ] = React.useState(props.item.value);
  const [ is_secret, set_is_secret ] = React.useState(props.item.is_secret);

  function handleNameFocus(event: React.FocusEvent<HTMLInputElement>): void {
    event.target.select();
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    set_name(event.target.value);
  }

  function handleValueFocus(event: React.FocusEvent<HTMLTextAreaElement>): void {
    event.target.select();
  }

  function handleValueChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    set_value(event.target.value);
  }

  function handleIsSecretButtonClick(): void {
    set_is_secret(!is_secret);
  }

  function handleFormSubmit(event: React.FormEvent): void {
    event.preventDefault();

    props.onAccept({
      name: name,
      value: value,
      is_secret: is_secret,
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
          <textarea value={ value } className="input-text-compact h-32" onFocus={ handleValueFocus } onChange={ handleValueChange } />
          <div>
            <button type="button" className="pl-2 pr-3 py-2.5 border border-gray-300 rounded flex items-center gap-x-2" onClick={ handleIsSecretButtonClick }>
              <div className={ classNames('p-0.5 border rounded-sm', { 'border-gray-200': !is_secret }, { 'bg-primary border-primary': is_secret }) }>
                {
                  (!is_secret) ?
                    <div className="w-4 h-4"></div>
                    :
                    <CheckLineIcon className="w-4 h-4 fill-white" />
                }
              </div>
              <span>Secret</span>
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-end gap-x-2">
          <button type="button" className="button-secondary" onClick={ handleCancelButtonClick }>Cancel</button>
          <button type="submit" className="button-primary">Save</button>
        </div>
      </div>
    </form>
  );
}
