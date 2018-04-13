import * as React from 'react';
import { IFolder } from '../../core';
import { FolderRow } from '../folder-row';
import { ItemRow } from '../item-row';

require('./index.less');

interface IFolderProps {
  folder: IFolder;
  onFolderSelect?(folder: IFolder): void;
}

interface IFolderState {
  query: string;
}

export class Folder extends React.PureComponent<IFolderProps, IFolderState> {
  constructor(props: IFolderProps) {
    super(props);

    this.state = {
      query: '',
    };
  }

  componentWillReceiveProps(props: IFolderProps): void {
    this.setState({
      query: '',
    });
  }

  private handleSearchChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      query: event.target.value,
    });
  }

  private handleFolderSelect(folder: IFolder): void {
    if (this.props.onFolderSelect)
      this.props.onFolderSelect(folder);
  }

  render(): JSX.Element {
    const folders = this.props.folder.folders.filter(folder => folder.name.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1);
    const items = this.props.folder.items.filter(item => item.name.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1);

    return (
      <div className="folder-component">
        <div>
          <div className="title">Search</div>
          <input className="search" value={this.state.query} onChange={this.handleSearchChange.bind(this)} />
        </div>
        {
          folders.length > 0 &&
            <div>
              <div className="title">Folders</div>
              <div className="folder-row-list">
              {
                folders.map((folder, index) => {
                  return <FolderRow folder={folder} onSelect={this.handleFolderSelect.bind(this, folder)} key={index} />;
                })
              }
              </div>
            </div>
        }
        {
          items.length > 0 &&
            <div>
              <div className="title">Items</div>
              <div  className="item-row-list">
              {
                items.map((item, index) => {
                  return <ItemRow item={item} key={index} />;
                })
              }
              </div>
            </div>
        }
      </div>
    );
  }
}
