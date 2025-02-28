// Do your work here...
document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  const STORAGE_KEY = "BOOKSHELF_APPS";

  function getBooks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function saveBooks(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
    <div class="card mb-3">
      <div class="card-body">
        <h2 data-testid="bookItemTitle" class="fw-semibold">${book.title}</h2>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button class="toggle btn btn-warning" data-testid="bookItemIsCompleteButton">
            ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
          </button>
          <button class="delete btn btn-danger" data-testid="bookItemDeleteButton">Hapus</button>
          <button class="edit btn btn-success" data-testid="bookItemEditButton">Edit</button>
        </div>
      </div>
    </div>
      `;

    bookItem.querySelector(".toggle").addEventListener("click", function () {
      toggleBookStatus(book.id);
    });

    bookItem.querySelector(".delete").addEventListener("click", function () {
      deleteBook(book.id);
    });

    bookItem.querySelector(".edit").addEventListener("click", function () {
      editBook(book.id);
    });

    return bookItem;
  }

  function renderBooks() {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    const books = getBooks();
    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  function addBook(title, author, year, isComplete) {
    const books = getBooks();
    const newBook = {
      id: +new Date(),
      title,
      author,
      year: Number(year),
      isComplete,
    };
    books.push(newBook);
    saveBooks(books);
    renderBooks();
  }

  function toggleBookStatus(bookId) {
    const books = getBooks();
    const bookIndex = books.findIndex((book) => book.id === bookId);
    if (bookIndex !== -1) {
      books[bookIndex].isComplete = !books[bookIndex].isComplete;
      saveBooks(books);
      renderBooks();
    }
  }

  function deleteBook(bookId) {
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus buku ini?"
    );
    if (!confirmDelete) return;

    const books = getBooks().filter((book) => book.id !== bookId);
    saveBooks(books);
    renderBooks();
  }

  function editBook(bookId) {
    const books = getBooks();
    const book = books.find((book) => book.id === bookId);

    if (book) {
      const newTitle = prompt("Masukkan judul baru:", book.title);
      const newAuthor = prompt("Masukkan penulis baru:", book.author);
      const newYear = prompt("Masukkan tahun baru:", book.year);

      if (newTitle && newAuthor && newYear) {
        book.title = newTitle;
        book.author = newAuthor;
        book.year = Number(newYear);
        saveBooks(books);
        renderBooks();
      }
    }
  }

  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, year, isComplete);
    bookForm.reset();
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const books = getBooks();

    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    filteredBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  });

  renderBooks();
});
