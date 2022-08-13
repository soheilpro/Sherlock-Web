import * as React from 'react';
import { IItem } from '../../core';
import { ClipboardFillIcon, ClipboardLineIcon, EyeFillIcon, EyeLineIcon } from '../images/icons';

interface IItemProps {
  item: IItem;
}

export function Item(props: IItemProps): JSX.Element {
  const [ show_secret, set_show_secret ] = React.useState(false);
  const [ is_copied_to_clipboard, set_is_copied_to_clipboard ] = React.useState(false);

  function handleToggleShowSecretButtonClick(): void {
    set_show_secret(!show_secret);
  }

  async function handleCopyToClipboardButtonClick(): Promise<void> {
    await navigator.clipboard.writeText(props.item.value);

    set_is_copied_to_clipboard(true);

    setTimeout(() => {
      set_is_copied_to_clipboard(false);
    }, 300);
  }

  function renderValue(): JSX.Element {
    if (props.item.is_secret && !show_secret)
      return <span className="external-text">{ new Array(props.item.value.length + 1).join('\u2022') }</span>;

    if (!props.item.is_secret && /^https?:\/\//.test(props.item.value))
      return <a href={ props.item.value } target="_blank" className="external-text hover-hover:hover:underline">{ props.item.value }</a>;

    return <span className="external-text whitespace-pre-line">{ props.item.value }</span>;
  }

  return (
    <div className="pl-4 pr-3 py-3 flex flex-col bg-white rounded group sm:pl-3 sm:py-2.5">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="font-semibold">{ props.item.name }</span>
          <div className="h-1"></div>
          <div className="max-w-xl text-green-700">
            { renderValue() }
          </div>
        </div>
        <div className="w-2"></div>
        <div className="mt-1 shrink-0 bg-gray-100 rounded-lg invisible group-hover:visible">
          {
            (props.item.is_secret) &&
              <button className="p-3 rounded-lg hover-hover:hover:bg-gray-200" onClick={ handleToggleShowSecretButtonClick }>
                {
                  (show_secret) ?
                    <EyeFillIcon className="w-5 h-5" />
                    :
                    <EyeLineIcon className="w-5 h-5" />
                }
              </button>
          }
          <button className="p-3 rounded-lg hover-hover:hover:bg-gray-200" onClick={ handleCopyToClipboardButtonClick }>
            {
              (is_copied_to_clipboard) ?
                <ClipboardFillIcon className="w-5 h-5" />
                :
                <ClipboardLineIcon className="w-5 h-5" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}
