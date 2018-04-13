import * as React from 'react';
import { IFolder } from '../../core';

require('./index.less');

interface IBreadcrumbProps {
  folder: IFolder;
  onFolderSelect?(folder: IFolder): void;
}

interface IBreadcrumbState {
}

export class Breadcrumb extends React.PureComponent<IBreadcrumbProps, IBreadcrumbState> {
  private getFolderPath(folder: IFolder): IFolder[] {
    const result = [];

    while (folder) {
      result.unshift(folder);
      folder = folder.parent;
    }

    return result;
  }

  private handleFolderClick(folder: IFolder, event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault();

    if (this.props.onFolderSelect)
      this.props.onFolderSelect(folder);
  }

  render(): JSX.Element {
    return (
      <div className="breadcrumb-component">
        {
          this.getFolderPath(this.props.folder).map((folder, index) => {
            return (
              <span key={index}>
                {
                  index !== 0 &&
                    <span className="separator">/</span>
                }
                <a className="folder" href="" onClick={this.handleFolderClick.bind(this, folder)}>{ folder.name }</a>
              </span>
            );
          })
        }
      </div>
    );
  }
}
