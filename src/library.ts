import { Book, User } from './models';

export class Library<T> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(predicate: (item: T) => boolean): void {
    this.items = this.items.filter((item) => !predicate(item));
  }

  getItems(): T[] {
    return this.items;
  }

  findItem(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  searchItems(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }
}
