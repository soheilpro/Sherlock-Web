import classNames from 'classnames';
import * as React from 'react';
import { IItem } from '../../../core';
import { CheckLineIcon, ClipboardLineIcon, EyeFillIcon, EyeLineIcon } from '../images/icons';

interface IItemViewProps {
  item: IItem;
  is_active: boolean;
}

export function ItemView(props: IItemViewProps): JSX.Element {
  const [ is_secret_shown, set_is_secret_shown ] = React.useState(false);
  const [ is_copied_to_clipboard, set_is_copied_to_clipboard ] = React.useState(false);

  function handleToggleShowSecretButtonClick(): void {
    set_is_secret_shown(!is_secret_shown);
  }

  async function handleCopyToClipboardButtonClick(): Promise<void> {
    await navigator.clipboard.writeText(props.item.value);

    set_is_copied_to_clipboard(true);

    setTimeout(() => {
      set_is_copied_to_clipboard(false);
    }, 500);
  }

  function renderValue(): JSX.Element {
    if (!props.item.value)
      return <span className="text-gray-400">{ '<no value>' }</span>;

    if (props.item.is_secret && !is_secret_shown)
      return <span className="external-text">{ new Array(props.item.value.length + 1).join('\u2022') }</span>;

    if (!props.item.is_secret && /^https?:\/\//.test(props.item.value) && props.is_active)
      return <a href={ props.item.value } target="_blank" className="external-text hover-hover:hover:underline">{ props.item.value }</a>;

    return <span className="external-text whitespace-pre-line">{ props.item.value }</span>;
  }

  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <span className={ classNames('font-semibold', { 'text-gray-400': !Boolean(props.item.name) }) }>{ props.item.name || '<no name>' }</span>
        <div className="h-1"></div>
        <div className="max-w-xl text-green-700">
          { renderValue() }
        </div>
      </div>
      {
        (props.is_active) &&
          <div className="ml-2 shrink-0 bg-gray-100 rounded-lg sm:mt-1">
            {
              (props.item.is_secret) &&
                <button className="p-3 rounded-lg hover-hover:hover:bg-primary hover-hover:hover:fill-white" onClick={ handleToggleShowSecretButtonClick }>
                  {
                    (is_secret_shown) ?
                      <EyeFillIcon className="w-5 h-5" />
                      :
                      <EyeLineIcon className="w-5 h-5" />
                  }
                </button>
            }
            <button className="p-3 rounded-lg hover-hover:hover:bg-primary hover-hover:hover:fill-white" onClick={ handleCopyToClipboardButtonClick }>
              {
                (is_copied_to_clipboard) ?
                  <CheckLineIcon className="w-5 h-5" />
                  :
                  <ClipboardLineIcon className="w-5 h-5" />
              }
            </button>
          </div>
      }
    </div>
  );
}
