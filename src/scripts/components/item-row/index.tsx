import * as React from 'react';
import { IItem } from '../../core';

require('./index.less');

interface IItemRowProps {
  item: IItem;
}

interface IItemRowState {
  showSecret: boolean;
}

export class ItemRow extends React.PureComponent<IItemRowProps, IItemRowState> {
  constructor(props: IItemRowProps) {
    super(props);

    this.state = {
      showSecret: false,
    };
  }

  private handleShowSecretClick(event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault();

    this.setState({
      showSecret: !this.state.showSecret,
    });
  }

  private handleCopyClick(event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault();

    const listener = (event: ClipboardEvent): void => {
      event.clipboardData.setData('text/plain', this.props.item.value);
      event.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }

  private renderValue(): JSX.Element {
    if (this.props.item.isSecret && !this.state.showSecret)
      return <span>{ new Array(this.props.item.value.length + 1).join('\u2022') }</span>;

    if (!this.props.item.isSecret && /https?:\/\//.test(this.props.item.value))
      return <a className="link" href={this.props.item.value} target="_blank">{ this.props.item.value }</a>;

    return <span>{ this.props.item.value }</span>;
  }

  render(): JSX.Element {
    return (
      <div className="item-row-component">
        <img className="icon" src={require('./item.svg')} />
        <span className="name">
          { this.props.item.name }
        </span>
        <div className="buttons">
          {
            this.props.item.isSecret &&
              <a className="button" href="" onClick={this.handleShowSecretClick.bind(this)}>{ !this.state.showSecret ? 'Show' : 'Hide' }</a>
          }
          <a className="button" href="" onClick={this.handleCopyClick.bind(this)}>Copy</a>
        </div>
        <div className="value">
          { this.renderValue() }
        </div>
      </div>
    );
  }
}
