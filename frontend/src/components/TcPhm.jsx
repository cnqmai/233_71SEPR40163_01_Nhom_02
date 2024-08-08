import { memo, useState } from "react";
import BookList from "./BookList";
import BookCardList from "./BookCardList";
import PropTypes from "prop-types";
import styles from "./TcPhm.module.css";

const TcPhm = memo(({ className = "", books }) => {
  const [selectedBook, setSelectedBook] = useState(null); // State để lưu trữ sách đã chọn

  // Hàm để cập nhật sách đã chọn
  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  return (
    <section className={[styles.tcPhm, className].join(" ")}>
      <h2 className={styles.tcPhm1}>Tác phẩm</h2>
      <div className={styles.thngTin}>
        <BookList books={books} onBookSelect={handleBookSelect} />
        <BookCardList book={selectedBook} />
      </div>
    </section>
  );
});

TcPhm.propTypes = {
  className: PropTypes.string,
  books: PropTypes.array.isRequired,
};

export default TcPhm;
