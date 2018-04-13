import * as React from 'react';
import { IFolder } from '../../core';

require('./index.less');

interface IFolderRowProps {
  folder: IFolder;
  onSelect?(folder: IFolder): void;
}

interface IFolderRowState {
}

export class FolderRow extends React.PureComponent<IFolderRowProps, IFolderRowState> {
  private handleClick(event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault();

    if (this.props.onSelect)
      this.props.onSelect(this.props.folder);
  }

  render(): JSX.Element {
    return (
      <div className="folder-row-component" onClick={this.handleClick.bind(this)}>
        <img className="icon" src={require('./folder.svg')} />
        <span className="name">{ this.props.folder.name }</span>
      </div>
    );
  }
}
