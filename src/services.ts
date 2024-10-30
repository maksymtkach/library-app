import { Book, User } from './models';
import { Library } from './library';

export class LibraryService {
  private bookLibrary: Library<Book>;
  private userLibrary: Library<User>;

  constructor() {
    this.bookLibrary = new Library<Book>();
    this.userLibrary = new Library<User>();
  }

  addBook(book: Book): void {
    this.bookLibrary.addItem(book);
  }

  getBooks(): Book[] {
    return this.bookLibrary.getItems();
  }

  removeBook(predicate: (book: Book) => boolean): void {
    this.bookLibrary.removeItem(predicate);
  }

  addUser(user: User): void {
    this.userLibrary.addItem(user);
  }

  getUsers(): User[] {
    return this.userLibrary.getItems();
  }

  borrowBook(userName: string, title: string): boolean {
    const user = this.userLibrary.findItem((u) => u.name === userName);
    if (user && user.borrowedBooks < 3) {
      const book = this.bookLibrary.findItem(
        (b) => b.title === title && !b.isBorrowed,
      );
      if (book) {
        book.isBorrowed = true;
        user.borrowedBooks++;
        return true;
      }
    }
    return false;
  }

  returnBook(userName: string, title: string): boolean {
    const user = this.userLibrary.findItem((u) => u.name === userName);
    const book = this.bookLibrary.findItem(
      (b) => b.title === title && b.isBorrowed,
    );
    if (user && book) {
      book.isBorrowed = false;
      user.borrowedBooks--;
      return true;
    }
    return false;
  }
}
