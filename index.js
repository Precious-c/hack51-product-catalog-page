let rating = 0;
let toggleState = false;

// //Preloader
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const mainContent = document.getElementById("main-content");

  // Hide the preloader and show the main content
  preloader.style.display = "none";
  mainContent.style.display = "block";
});

// Function to show the preloader
// function showPreloader() {
//   document.getElementById("preloader").style.display = "flex";
// }

// // Function to hide the preloader
// function hidePreloader() {
//   document.getElementById("preloader").style.display = "none";
// }

// Flash of Unstyled Content HAck
// // Helper function
// let domReady = (cb) => {
//   document.readyState === "interactive" || document.readyState === "complete"
//     ? cb()
//     : document.addEventListener("DOMContentLoaded", cb);
// };

// domReady(() => {
//   // Display body when DOM is loaded
//   document.body.style.visibility = "visible";
// });

async function expandList(element) {
  const filterType = element.getAttribute("data-filter");
  const filterList = document.querySelector(`[data-content="${filterType}"]`);
  //chevron icons
  const expandicon = document.getElementById("expand-icon");
  const chevronRight = document.getElementById("chevron-right");

  // get amd populate genres dynamically
  const response = await fetch("./data/genres.json");
  const genresData = await response.json();

  let genreList = document.getElementById("genre-list");
  genreList.innerHTML = ""; // remove previous items in the list

  // create genre elements and add them to the genre list
  genresData.forEach((genre) => {
    const newGenre = document.createElement("div");
    newGenre.innerHTML = `<div>
                  <input
                    type="checkbox"
                    class="filter-input"
                    value="${genre}"
                    name="${genre}"
                    id="${genre}"
                  />
                  <label for="${genre}">${genre}</label>
                </div>`;

    genreList.appendChild(newGenre);
  });

  // toogle the show class
  filterList.classList.toggle("show");
  expandicon.classList.toggle("show");
  chevronRight.classList.toggle("hide");
}

// handle rating icon click
function handleIconClick(element) {
  // reset other icons
  document
    .querySelectorAll(".rating-icon")
    .forEach((item) => item.classList.replace("rating-clicked", "u"));
  // add clicked class
  element.classList.toggle("rating-clicked");

  rating = element.getAttribute("data-value");
}

async function displayBooks(data) {
  // showPreloader();
  try {
    let booksData = data;

    //fetch books data
    if (!booksData) {
      const response = await fetch("./data/hack51_sample_book.json");
      // const response = await fetch("./data/books_data2.json");
      booksData = await response.json();
    }

    //get books container element
    const booksGrid = document.getElementById("books-grid");
    booksGrid.innerHTML = "";

    // format price in currency format
    let naira = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });

    if (booksData.length === 0) {
      const errorPage = document.createElement("div");
      errorPage.innerHTML = `
        <div class="error-page" id="error-page">
            <img src="./assets//illustration.gif" alt="no kooks found">
            <p>Sorry, No matches found! Try a different title, author, or genre. </p>
        </div>
      `;
      booksGrid.appendChild(errorPage);
      return;
    }

    booksData.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.classList.add("book-card");

      bookCard.innerHTML = `
      <div class="cover-image-container">
        <img
          src="${book.coverImage}"
          alt="${book.title} cover image"
          class="cover-image"
        />
      </div>
      <div class="book-details-container">
        <p class="rating">${book.rating}</p>
        <p class="author">${book.author || book.authors}</p>
        <p class="book-title">${book.title}</p>
        <p class="price">${naira.format(book.price)}</p>
      </div>      
    `;
      booksGrid.appendChild(bookCard);
    });
  } catch (err) {
    console.log(err);
  }
}

async function handleFilter() {
  //get genres
  handleFilterToggle();
  const genres = [];
  let genreList = document.querySelectorAll(".filter-input");
  genreList.forEach((item) => {
    if (item.checked) genres.push(item.value);
  });

  //get price
  const pricesInput = document.querySelectorAll(".price-input");
  const minPrice = Number(pricesInput[0].value);
  const maxPrice = Number(pricesInput[1].value);

  // fetch books data
  const response = await fetch("./data/hack51_sample_book.json");
  const booksData = await response.json();

  let filteredBooks = booksData;

  //filter genre
  if (genres.length !== 0) {
    console.log("ran genres");
    filteredBooks = booksData.filter((book) => {
      return genres.some((item) => new RegExp(item, "i").test(book.genre));
    });
  }

  // filter price
  if (minPrice > 0 || maxPrice > 0) {
    filteredBooks = filteredBooks.filter(
      (book) => book.price >= minPrice && book.price <= (maxPrice || Infinity)
    );
  }

  //filter rating
  if (rating) {
    console.log("ran rating");
    filteredBooks = filteredBooks.filter((book) => book.rating >= rating);
  }

  displayBooks(filteredBooks);
}

// Handle search
const searchForm = document.getElementById("search-form");
const searchFormWd = document.getElementById("search-form-wd");
const searchInput = document.getElementById("search-input");
const searchInputWd = document.getElementById("search-input-wd");

searchForm.addEventListener("submit", searchHandler);
searchFormWd.addEventListener("submit", searchHandler);

async function searchHandler(e) {
  e.preventDefault();

  const resposne = await fetch("./data/hack51_sample_book.json");
  const booksData = await resposne.json();

  console.log(e.target.id);
  console.log(searchForm.id, searchFormWd.id);
  let searchResults = [];
  if (e.target.id === searchForm.id) {
    searchResults = booksData.filter((book) => {
      const regex = new RegExp(searchInput.value, "i");
      return regex.test(book.title);
    });
  }

  if (e.target.id === searchFormWd.id) {
    searchResults = booksData.filter((book) => {
      const regex = new RegExp(searchInputWd.value, "i");
      return regex.test(book.title);
    });
  }

  displayBooks(searchResults);
}
// async function handleSearch(e) {
//   alert(element);
//   e.preventDefault();
// }

const filterToggle = document.getElementById("filter-toggle");
const filterSection = document.getElementById("filter-section");

filterToggle.addEventListener("click", handleFilterToggle);

function handleFilterToggle(e) {
  toggleState = !toggleState;
  console.log({ toggleState });
  if (!toggleState) {
    filterSection.classList.add("filter-section-hide");
    filterSection.classList.remove("filter-section-show");
  }
  if (toggleState) {
    filterSection.classList.add("filter-section-show");
    filterSection.classList.remove("filter-section-hide");
  }
}

displayBooks();
