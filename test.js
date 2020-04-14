var Book = function (isbn, title, author) {
    var _isbn, _title, _author;

    function isValidIsbn(isbn) {
        if (isbn === undefined || typeof isbn != 'string') {
            return false;
        }

        return true;
    }

    this.getIsbn = function () {
        return _isbn;
    }
    this.setIsbn = function () {
        if (!isValidIsbn(isbn)) {
            throw new Error('The isbn passed in is invalid.');
        }
        _isbn = isbn;
    };
    this.getTitle = function () {
        return _title;
    };
    this.setTitle = function () {
        _title = title || 'No title specified';
    };
    this.getAuthor = function () {
        return _author;
    };
    this.setAuthor = function () {
        _author = author || 'No author specified';
    };

    this.setIsbn(isbn);
    this.setTitle(title);
    this.setAuthor(author);
};
Book.prototype.display = function () {
    console.log("isbn: " + this.getIsbn() + ", title: " + this.getTitle() + ", author: " + this.getAuthor());
};