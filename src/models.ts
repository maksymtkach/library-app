import { v4 as uuidv4 } from 'uuid';

export interface IBook {
  title: string;
  author: string;
  year: number;
  isBorrowed: boolean;
}

export class Book implements IBook {
  constructor(
    private _title: string,
    private _author: string,
    private _year: number,
    private _isBorrowed: boolean = false,
  ) {}

  get title(): string {
    return this._title;
  }

  get author(): string {
    return this._author;
  }

  get year(): number {
    return this._year;
  }

  get isBorrowed(): boolean {
    return this._isBorrowed;
  }

  set isBorrowed(value: boolean) {
    this._isBorrowed = value;
  }
}

export interface IUser {
  name: string;
  email: string;
  id: string;
}

export class User implements IUser {
  constructor(
    private _name: string,
    private _email: string,
    private _id: string = uuidv4(),
    private _borrowedBooks: number = 0,
  ) {}

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get id(): string {
    return this._id;
  }

  get borrowedBooks(): number {
    return this._borrowedBooks;
  }

  set borrowedBooks(value: number) {
    this._borrowedBooks = value;
  }
}
