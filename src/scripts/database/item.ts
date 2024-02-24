import { IFolder, IItem, ItemEventType } from '../core';
import { EventEmitter } from '../util';
import { Sequence } from './sequence';

export class Item extends EventEmitter<ItemEventType> implements IItem {
  public id: string;
  public parent: IFolder | undefined;
  public name: string;
  public value: string;
  public is_secret: boolean;

  public constructor(props: { parent?: IFolder; name: string; value: string; is_secret: boolean; }) {
    super();

    this.id = Sequence.next();
    this.parent = props.parent;
    this.name = props.name;
    this.value = props.value;
    this.is_secret = props.is_secret;
  }

  public setName(name: string): void {
    this.name = name;

    this.emit('name-changed');
  }

  public setValue(value: string): void {
    this.value = value;

    this.emit('value-changed');
  }

  public setIsSecret(is_secret: boolean): void {
    this.is_secret = is_secret;

    this.emit('is-secret-changed');
  }

  public clone(): IItem {
    return new Item({
      parent: this.parent,
      name: this.name,
      value: this.value,
      is_secret: this.is_secret,
    });
  }
}
