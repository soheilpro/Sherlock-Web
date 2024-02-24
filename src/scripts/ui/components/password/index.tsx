import classNames from 'classnames';
import * as React from 'react';

interface IPasswordProps {
  is_invalid: boolean;
  onEnter(password: string): void;
  onCancel(): void;
}

export function Password(props: IPasswordProps): JSX.Element {
  const [ password, set_password ] = React.useState('');
  const [ is_shaking, set_is_shaking ] = React.useState(props.is_invalid);

  React.useEffect(() => {
    set_is_shaking(props.is_invalid);
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    set_password(event.target.value);
  }

  async function handleFormSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();

    if (password)
      props.onEnter(password);

    set_password('');
    set_is_shaking(false);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="h-12"></div>
      <h1 className="font-bold text-3xl text-center">Password</h1>
      <div className="h-12"></div>
      <form className="w-64 grid gap-5" onSubmit={ handleFormSubmit }>
        <input type="password" value={ password } autoComplete="off" autoFocus={ true } className={ classNames('input-text min-w-64', { 'shake': is_shaking }) } onChange={ handleInputChange } />
        <button type="submit" disabled={ !password } className="button-primary min-w-64">OK</button>
        <div></div>
        <button type="button" className="button-link justify-self-center" onClick={ props.onCancel }>Cancel</button>
      </form>
    </div>
  );
}
