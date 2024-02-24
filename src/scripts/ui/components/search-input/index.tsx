import * as React from 'react';

interface ISearchProps {
  query: string;
  onChange(query: string): void;
}

export function SearchInput(props: ISearchProps): JSX.Element {
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    props.onChange(event.target.value);
  }

  return (
    <input type="search" value={ props.query } placeholder="Search..." className="input-text" onChange={ handleInputChange } />
  );
}
