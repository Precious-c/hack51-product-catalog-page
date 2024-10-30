const rawData = require("./amazon.books");
const rawData2 = require("../../../../../Documents/Amazon_popular_books_dataset.json");
const fs = require("fs");

const cleanedData = [];
// const rawDataArray = Array(rawData);

rawData2.forEach((book, i) => {
  //   const newBook = {
  //     id: book._id,
  //     title: book.title,
  //     authors: book.authors[1],
  //     genre: "programming",
  //     coverImage: book.thumbnailUrl,
  //     description: book.shortDescription,
  //     rating: Number((Math.random() * (5.0 - 3.0) + 3.0).toFixed(1)), //generate random number between 3.0 and 5.0
  //     price: Math.ceil(Math.random() * (30000 - 5000) + 5000),
  //   };

  const newBook = {
    id: i + Math.ceil(Math.random() * 10),
    title: book.title,
    authors: book.brand ? book.brand.split(",")[0].trim() : "Anonymous",
    genre: book.categories[1],
    coverImage: book.image_url,
    rating: Number((Math.random() * (5.0 - 3.0) + 3.0).toFixed(1)), //generate random number between 3.0 and 5.0
    price: Math.ceil(Math.random() * (30000 - 5000) + 5000),
  };

  if (newBook.coverImage) cleanedData.push(newBook);
});

const hundredRandomBooks = [];

for (let i = 0; i < 20; i++) {
  hundredRandomBooks.push(cleanedData[Math.ceil(Math.random() * cleanedData.length)]);
}

fs.writeFile("books_data2.json", JSON.stringify(hundredRandomBooks, null, 2), (err) => {
  if (err) {
    console.error("Error writing JSON to file:", err);
  } else {
    console.log("JSON data written to file successfully.");
  }
});
