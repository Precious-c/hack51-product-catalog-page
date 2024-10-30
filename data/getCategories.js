const data = require("./hack51_sample_book.json");
const fs = require("fs");

let cleanedData = [];
data.forEach((book) => cleanedData.push(book.genre));

cleanedData = [...new Set(cleanedData)];

fs.writeFile("genres.json", JSON.stringify(cleanedData, null, 2), (err) => {
  if (err) {
    console.error("Error writing JSON to file:", err);
  } else {
    console.log("JSON data written to file successfully.");
  }
});
