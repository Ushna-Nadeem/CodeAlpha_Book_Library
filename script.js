document.addEventListener("DOMContentLoaded", () => {
    const addBookForm = document.getElementById("addBookForm");
    const bookList = document.getElementById("bookList");
    const search = document.getElementById("search");
  
    let books = JSON.parse(localStorage.getItem("books")) || [];
  
    addBookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const author = document.getElementById("author").value;
      const genre = document.getElementById("genre").value;
      const year = document.getElementById("year").value;
  
      const newBook = {
        title,
        author,
        genre,
        year,
        isBorrowed: false,
        borrower: null,
        borrowDate: null,
      };
  
      books.push(newBook);
      localStorage.setItem("books", JSON.stringify(books));
      displayBooks();
      addBookForm.reset();
    });
  
    search.addEventListener("input", () => {
      const query = search.value.toLowerCase();
      const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
      displayBooks(filteredBooks);
    });
  
    function displayBooks(filteredBooks = books) {
      bookList.innerHTML = "";
  
      filteredBooks.forEach((book, index) => {
        const li = document.createElement("li");
  
        li.innerHTML = `
          <strong>${book.title}</strong> by ${book.author} (${book.genre}, ${book.year})
          ${book.isBorrowed ? `<span>Borrowed by: ${book.borrower}</span>` : ""}
          <button class="${book.isBorrowed ? 'return' : 'borrow'}" data-index="${index}">
            ${book.isBorrowed ? "Return" : "Borrow"}
          </button>
        `;
  
        bookList.appendChild(li);
      });
  
      addEventListeners();
    }
  
    function addEventListeners() {
      const borrowButtons = document.querySelectorAll(".borrow");
      const returnButtons = document.querySelectorAll(".return");
  
      borrowButtons.forEach(button => {
        button.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          const borrowerName = prompt("Enter borrower name:");
          if (borrowerName) {
            books[index].isBorrowed = true;
            books[index].borrower = borrowerName;
            books[index].borrowDate = new Date().toISOString().split("T")[0];
            localStorage.setItem("books", JSON.stringify(books));
            displayBooks();
          }
        });
      });
  
      returnButtons.forEach(button => {
        button.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          books[index].isBorrowed = false;
          books[index].borrower = null;
          books[index].borrowDate = null;
          localStorage.setItem("books", JSON.stringify(books));
          displayBooks();
        });
      });
    }
  
    displayBooks();
  });
