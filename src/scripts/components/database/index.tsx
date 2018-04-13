import * as React from 'react';
import { IDatabase, IFolder } from '../../core';
import { Breadcrumb } from '../breadcrumb';
import { Folder } from '../folder';

require('./index.less');

interface IDatabaseProps {
  database: IDatabase;
  onUnload?(): void;
}

interface IDatabaseState {
  currentFolder: IFolder;
}

export class Database extends React.PureComponent<IDatabaseProps, IDatabaseState> {
  constructor(props: IDatabaseProps) {
    super(props);

    this.state = {
      currentFolder: props.database.rootFolder,
    };
  }

  private handleFolderSelect(folder: IFolder): void {
    this.setState({
      currentFolder: folder,
    });
  }

  private handleUnloadClick(event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault();

    if (this.props.onUnload)
      this.props.onUnload();
  }

  render(): JSX.Element {
    return (
      <div className="database-component">
        <a className="unload" href="" onClick={this.handleUnloadClick.bind(this)}>Unload</a>
        <Breadcrumb folder={this.state.currentFolder} onFolderSelect={this.handleFolderSelect.bind(this)} />
        <Folder folder={this.state.currentFolder} onFolderSelect={this.handleFolderSelect.bind(this)} />
      </div>
    );
  }
}
