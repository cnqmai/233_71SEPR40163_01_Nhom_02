import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import styles from "./BookCard.module.css";

const BookCard = memo(({ className = "", book }) => {
  const [authors, setAuthors] = useState([]); // State to store author data

  useEffect(() => {
    const fetchAuthors = async () => {
      if (book && book.TacGia && book.TacGia.length > 0) {
        const token = localStorage.getItem('token');
        try {
          const authorRequests = book.TacGia.map((authorId) =>
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
    };

    fetchAuthors();
  }, [book]);

  if (!book) return null; // Nếu không có dữ liệu sách, không hiển thị gì

  // Xử lý danh sách tác giả
  const authorNames = authors.length > 0
    ? authors.map((author, index) => (
        <span key={author._id}>
          {index > 0 && ', '} 
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
            <Link to={`/sach/${book.TieuDe}`} style={{ textDecoration: 'none', color: '#000000' }}>
              {book.TieuDe}
            </Link>
          </h3>
          <div className={styles.auth}>{authorNames}</div>
        </div>
        <div className={styles.summary}>
          {book.TomTat || "No summary available."}
        </div>
      </div>
    </div>
  );
});

BookCard.propTypes = {
  className: PropTypes.string,
  book: PropTypes.shape({
    TieuDe: PropTypes.string.isRequired,
    TacGia: PropTypes.arrayOf(
      PropTypes.string.isRequired // ID của tác giả
    ).isRequired,
    TomTat: PropTypes.string,
    AnhBia: PropTypes.string
  })
};

export default BookCard;
