import * as React from 'react';

require('./index.less');

interface IPasswordProps {
  onEnter(password: string): void;
  onCancel(): void;
}

interface IPasswordState {
  password: string;
}

export class Password extends React.PureComponent<IPasswordProps, IPasswordState> {
  constructor(props: IPasswordProps) {
    super(props);

    this.state = {
      password: '',
    };
  }

  componentWillReceiveProps(props: IPasswordProps): void {
    this.setState({
      password: '',
    });
  }

  private handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      password: event.target.value,
    });
  }

  private async handleFormSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (this.state.password)
      this.props.onEnter(this.state.password);

      this.setState({
        password: '',
      });
    }

  private handleCancel(event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault();

    this.props.onCancel();
  }

  render(): JSX.Element {
    return (
      <div className="password-component">
        <div className="title">Password?</div>
        <form onSubmit={this.handleFormSubmit.bind(this)}>
          <input className="input" type="password" autoComplete="off" autoFocus={true} value={this.state.password} onChange={this.handleInputChange.bind(this)} />
          <input className="ok" type="submit" value="OK" />
          <a className="cancel" href="" onClick={this.handleCancel.bind(this)}>Cancel</a>
        </form>
      </div>
    );
  }
}
