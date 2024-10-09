let API_URL = "https://gutendex.com";

window.curPageOfBooks = [];

function createBookCard(book) {
    let id = book.id;
    let title = book.title;
    let author = "N/A", authorBirthYear = "", authorDeathYear = "";
    if (book.authors.length > 0) {
        // take first author
        author = book.authors[0].name;
        authorBirthYear = book.authors[0].birth_year;
        authorDeathYear = book.authors[0].death_year;
    }
    let genres = book.bookshelves;
    let link = document.createElement("a");
    link.className = "bookContainer";
    link.href = "?bookId=" + id;
    let inner = `
        <img class="bookImg" src="${book.formats["image/jpeg"]}" alt="${title}" />
        <h2>${title}</h2>
        <p>By ${author} (${authorBirthYear} - ${authorDeathYear})</p>
        <p>Genres: ${genres}</p>
    `;
    link.innerHTML = inner;
    return link;
}

function getAllBooks() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL + "/books", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var books = JSON.parse(xhr.responseText);

            // hide the loading spinner
            document.getElementById("loading").style.display = "none";

            let listing = document.getElementById("listing");
            let results = books.results
            window.curPageOfBooks = results;
            listing.innerHTML = "";
            for (var book of results) {
                let link = createBookCard(book);
                listing.appendChild(link);
            }
        }
    };
    xhr.send();
}

function getBook() {
    var bookId = document.getElementById("bookId").value;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL + "/books/" + bookId, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var book = JSON.parse(xhr.responseText);
            var pages = document.getElementById("pages");
            pages.innerHTML = "";
            for (var i = 0; i < book.text.length; i++) {
                var page = document.createElement("div");
                page.innerHTML = book.text[i];
                pages.appendChild(page);
            }
            var listing = document.getElementById("listing");
            listing.innerHTML = "";
            for (var i = 0; i < book.text.length; i++) {
                var link = document.createElement("a");
                link.href = "#";
                link.innerHTML = "Page " + (i + 1);
                link.onclick = function() {
                    pages.scrollTop = pages.children[parseInt(this.innerHTML.split(" ")[1]) - 1].offsetTop;
                };
                listing.appendChild(link);
            }
        }
    };
    xhr.send();
}

document.addEventListener("DOMContentLoaded", function() {
    getAllBooks();
    // document.getElementById("bookId").onchange = getBook;
});

window.darkMode = false;

function toggleDarkTheme() {
    window.darkMode = !window.darkMode;
    if (window.darkMode) {
        document.body.style.backgroundColor = "#333";
        document.body.style.color = "#fff";
    } else {
        document.body.style.backgroundColor = "#fff";
        document.body.style.color = "#333";
    }
}