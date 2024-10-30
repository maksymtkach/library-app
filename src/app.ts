import { Book, User } from './models';
import { LibraryService } from './services';
import { Validation } from './validation';
import { Storage } from './storage';
import { Modal } from './modal';

(function () {
  const libraryService = new LibraryService();

  Storage.removeItem('books');
  Storage.removeItem('users');
  const sampleBooks = [
    new Book('The Great Gatsby', 'F. Scott Fitzgerald', 1925),
    new Book('To Kill a Mockingbird', 'Harper Lee', 1960),
    new Book('1984', 'George Orwell', 1949),
    new Book('Pride and Prejudice', 'Jane Austen', 1813),
    new Book('The Catcher in the Rye', 'J.D. Salinger', 1951),
    new Book('Moby-Dick', 'Herman Melville', 1851),
  ];

  const sampleUsers = [
    new User('John Doe', 'john.doe@example.com'),
    new User('Jane Smith', 'jane.smith@example.com'),
    new User('Alice Johnson', 'alice.johnson@example.com'),
    new User('Bob Brown', 'bob.brown@example.com'),
    new User('Charlie Davis', 'charlie.davis@example.com'),
    new User('Eve Miller', 'eve.miller@example.com'),
  ];

  sampleBooks.forEach((book) => libraryService.addBook(book));
  sampleUsers.forEach((user) => libraryService.addUser(user));

  Storage.save('books', libraryService.getBooks());
  Storage.save('users', libraryService.getUsers());

  const bookTitleInput = document.getElementById(
    'bookTitle',
  ) as HTMLInputElement;
  const bookAuthorInput = document.getElementById(
    'bookAuthor',
  ) as HTMLInputElement;
  const bookYearInput = document.getElementById('bookYear') as HTMLInputElement;

  const userNameInput = document.getElementById('userName') as HTMLInputElement;
  const userEmailInput = document.getElementById(
    'userEmail',
  ) as HTMLInputElement;

  const bookList = document.getElementById('bookList');
  const userList = document.getElementById('userList');

  const borrowBookModal = new Modal('borrowBookModal');
  const returnBookModal = new Modal('returnBookModal');
  const notificationModal = new Modal('notificationModal');
  let currentBookTitle = '';

  // Load saved data
  const savedBooks = Storage.load<Book[]>('books');
  if (savedBooks) {
    savedBooks.forEach((book) => libraryService.addBook(book));
    displayBooks();
  }

  const savedUsers = Storage.load<User[]>('users');
  if (savedUsers) {
    savedUsers.forEach((user) => libraryService.addUser(user));
    displayUsers();
  }

  document.getElementById('bookForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = bookTitleInput.value;
    const author = bookAuthorInput.value;
    const year = parseInt(bookYearInput.value);
    const yearValidationError = document.getElementById('yearValidationError');

    if (Validation.isValidYear(year)) {
      const book = new Book(title, author, year);
      libraryService.addBook(book);
      Storage.save('books', libraryService.getBooks());
      displayBooks();
      bookTitleInput.value = '';
      bookAuthorInput.value = '';
      bookYearInput.value = '';
      if (yearValidationError) yearValidationError.textContent = '';
      showNotification(`Книгу '${title}' успішно додано.`);
    } else {
      if (yearValidationError) yearValidationError.textContent = 'Невірний рік';
    }
  });

  document.getElementById('userForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = userNameInput.value;
    const email = userEmailInput.value;
    const emailValidationError = document.getElementById(
      'emailValidationError',
    );

    if (Validation.isValidEmail(email)) {
      const user = new User(name, email);
      libraryService.addUser(user);
      Storage.save('users', libraryService.getUsers());
      displayUsers();
      userNameInput.value = '';
      userEmailInput.value = '';
      if (emailValidationError) emailValidationError.textContent = '';
      showNotification(`Користувача '${name}' успішно додано.`);
    } else {
      if (emailValidationError)
        emailValidationError.textContent = 'Невірний email';
    }
  });

  document.getElementById('borrowBookForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = (document.getElementById('borrowUserId') as HTMLInputElement)
      .value;

    const user = libraryService.getUsers().find((u) => u.id === userId);

    if (user) {
      if (libraryService.borrowBook(user.name, currentBookTitle)) {
        Storage.save('books', libraryService.getBooks());
        Storage.save('users', libraryService.getUsers());
        displayBooks();
        displayUsers();
        showNotification(
          `Книгу '${currentBookTitle}' успішно позичено користувачем з ID: ${userId}.`,
        );
      } else {
        showNotification(
          `Книга '${currentBookTitle}' недоступна для позичання або користувач перевищив ліміт.`,
        );
      }
    } else {
      showNotification('Користувача з таким ID не знайдено.');
    }

    borrowBookModal.close();
  });

  document.getElementById('returnBookForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = (document.getElementById('returnUserId') as HTMLInputElement)
      .value;

    const user = libraryService.getUsers().find((u) => u.id === userId);

    if (user) {
      if (libraryService.returnBook(user.name, currentBookTitle)) {
        Storage.save('books', libraryService.getBooks());
        Storage.save('users', libraryService.getUsers());
        displayBooks();
        displayUsers();
        showNotification(
          `Книгу '${currentBookTitle}' успішно повернено користувачем з ID: ${userId}.`,
        );
      } else {
        showNotification(
          `Книга '${currentBookTitle}' не була позичена або не знайдена.`,
        );
      }
    } else {
      showNotification('Користувача з таким ID не знайдено.');
    }

    returnBookModal.close();
  });

  function displayBooks(page: number = 1, pageSize: number = 5): void {
    if (bookList) {
      bookList.innerHTML = '';
      const books = libraryService.getBooks();
      const paginatedBooks = books.slice(
        (page - 1) * pageSize,
        page * pageSize,
      );

      paginatedBooks.forEach((book) => {
        const li = document.createElement('li');
        li.className =
          'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = `${book.title} by ${book.author} (${book.year}) ${book.isBorrowed ? ' - Позичено' : ''}`;

        const buttonContainer = document.createElement('div');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.className = 'btn btn-danger btn-sm ml-2';
        deleteButton.addEventListener('click', () => {
          libraryService.removeBook(
            (b) =>
              b.title === book.title &&
              b.author === book.author &&
              b.year === book.year,
          );
          Storage.save('books', libraryService.getBooks());
          displayBooks();
        });

        const borrowButton = document.createElement('button');
        borrowButton.textContent = 'Позичити';
        borrowButton.className = 'btn btn-primary btn-sm ml-2';
        borrowButton.addEventListener('click', () => {
          currentBookTitle = book.title;
          borrowBookModal.open();
        });

        const returnButton = document.createElement('button');
        returnButton.textContent = 'Повернути';
        returnButton.className = 'btn btn-secondary btn-sm ml-2';
        returnButton.addEventListener('click', () => {
          currentBookTitle = book.title;
          returnBookModal.open();
        });

        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(borrowButton);
        buttonContainer.appendChild(returnButton);
        li.appendChild(buttonContainer);
        bookList.appendChild(li);
      });
    }
  }

  function displayUsers(): void {
    if (userList) {
      userList.innerHTML = '';
      libraryService.getUsers().forEach((user) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${user.name} (${user.email}) - ID: ${user.id}`;
        userList.appendChild(li);
      });
    }
  }

  function showNotification(message: string): void {
    const modalContent = document.getElementById('notificationModalContent');
    if (modalContent) {
      modalContent.innerHTML = `<p>${message}</p><hr><div class="text-right"><button class="btn btn-info" onclick="closeNotification()">OK</button></div>`;
      notificationModal.open();
    }
  }

  function closeNotification(): void {
    notificationModal.close();
  }
})();
