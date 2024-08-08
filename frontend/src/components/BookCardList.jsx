import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import styles from "./BookCard.module.css";

const BookCardList = memo(({ className = "", book }) => {
  const [authors, setAuthors] = useState([]); // State để lưu trữ dữ liệu tác giả

  useEffect(() => {
    const fetchAuthors = async () => {
      if (book && book.TacGia) {
        const token = localStorage.getItem('token');
        // Nếu TacGia là một đối tượng, chuyển thành mảng
        const authorIds = Array.isArray(book.TacGia) ? book.TacGia : [book.TacGia];

        if (authorIds.length > 0) {
          try {
            const authorRequests = authorIds.map((authorId) =>
              axios.get(`http://localhost:3000/api/authors/getauthorbyobjectid/${authorId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
            );

            const responses = await Promise.all(authorRequests);
            const fetchedAuthors = responses.map((response) => response.data);
            setAuthors(fetchedAuthors);
          } catch (error) {
            console.error('Error fetching author data:', error);
          }
        }
      }
    };

    fetchAuthors();
  }, [book]);

  if (!book) return null;

  // Xử lý danh sách tác giả
  const authorNames = authors.length > 0
    ? authors.map((author, index) => (
        <span key={author._id}>
          {index > 0 && ', '} {/* Thêm dấu phẩy giữa các tên tác giả */}
          {author.HoTen || 'Tên tác giả không có'}
        </span>
      ))
    : 'Thông tin tác giả không có';

  return (
    <div className={[styles.bookCard, className].join(" ")}>
      <img
        className={styles.bookcover}
        alt={book.TieuDe}
        src={book.AnhBia ? `/images/${book.AnhBia}` : "/default-cover.png"}
      />
      <div className={styles.bookinfo}>
        <div className={styles.name_auth}>
          <h3 className={styles.name}>
            <Link to={`/sach/${book.TieuDe}`} style={{ textDecoration: 'none', color: '#000000' }}>{book.TieuDe}</Link>
          </h3>
          <div className={styles.auth}>{authorNames}</div>
        </div>
        <div className={styles.summary}>{book.TomTat || "No summary available."}</div>
      </div>
    </div>
  );
});

BookCardList.propTypes = {
  className: PropTypes.string,
  book: PropTypes.shape({
    TieuDe: PropTypes.string.isRequired,
    TacGia: PropTypes.oneOfType([
      PropTypes.string, // ID của tác giả nếu chỉ có một tác giả
      PropTypes.arrayOf(PropTypes.string) // Mảng các ID của tác giả nếu có nhiều tác giả
    ]),
    TomTat: PropTypes.string,
    AnhBia: PropTypes.string,
    TenSach: PropTypes.string.isRequired
  })
};

export default BookCardList;
