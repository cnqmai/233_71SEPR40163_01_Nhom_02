import { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import styles from "./BookIllu.module.css";

const BookIllu = memo(({ className = "", genre, onBookSelect }) => {
  const [books, setBooks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      const token = localStorage.getItem('token');
        
      try {
        const response = await fetch(`http://localhost:3000/api/books/getbooksbygenres/${genre}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Giới hạn số lượng sách hiển thị là 6
        setBooks(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching related books:', error);
      }
    };

    if (genre) {
      fetchRelatedBooks();
    }
  }, [genre]);

  useEffect(() => {
    // Chọn cuốn sách đầu tiên mặc định khi danh sách sách được tải lần đầu
    if (books.length > 0 && activeIndex === null) {
      setActiveIndex(0);
      onBookSelect(books[0]);
    }
  }, [books, activeIndex, onBookSelect]);

  const handleButtonClick = (index, book) => {
    setActiveIndex(index);
    onBookSelect(book); // Truyền toàn bộ thông tin sách lên component cha
  };

  return (
    <div className={[styles.bookIllu, className].join(" ")}>
      {books.map((book, index) => (
        <button
          key={index}
          className={`${styles[`bookWrapper${index + 1}`]} ${activeIndex === index ? styles.active : ""}`}
          onClick={() => handleButtonClick(index, book)}
        >
          <i className={styles.title}>{book.TieuDe}</i>
        </button>
      ))}
    </div>
  );
});

BookIllu.propTypes = {
  genre: PropTypes.string.isRequired,
  className: PropTypes.string,
  onBookSelect: PropTypes.func.isRequired, // Thêm propTypes cho onBookSelect
};

export default BookIllu;
