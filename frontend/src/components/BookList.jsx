import { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./BookList.module.css";

const BookList = memo(({ className = "", books, onBookSelect }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    // Chọn cuốn sách đầu tiên mặc định chỉ khi danh sách sách được tải lần đầu
    if (books.length > 0 && activeIndex === null) {
      setActiveIndex(0);
      onBookSelect(books[0]);
    }
  }, [books, activeIndex, onBookSelect]);

  const handleButtonClick = (index, book) => {
    setActiveIndex(index);
    onBookSelect(book);
  };

  return (
    <div className={[styles.booklist, className].join(" ")}>
      {books.map((book, index) => (
        <button
          key={book._id}
          className={`${styles.row} ${activeIndex === index ? styles.active : ""}`}
          onClick={() => handleButtonClick(index, book)}
        >
          <div className={styles.title}>{book.TieuDe}</div>
        </button>
      ))}
    </div>
  );
});

BookList.propTypes = {
  className: PropTypes.string,
  books: PropTypes.array.isRequired,
  onBookSelect: PropTypes.func.isRequired,
};

export default BookList;
