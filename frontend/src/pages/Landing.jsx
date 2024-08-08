import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import styles from "./Landing.module.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const highRatedBooksRef = useRef(null);
  const favAuthorsRef = useRef(null);

  const images = [
    { src: "/images/HarryPotterAndTheChamberOfSecrets.jpg", alt: "Harry Potter and the Chamber of Secrets" },
    { src: "/images/MattHaig_portrait.jpg", alt: "Matt Haig" },
    { src: "/images/HarryPotterAndThePrisonerOfAzkaban.jpg", alt: "Harry Potter and the Prisoner of Azkaban" },
    { src: "/images/ThomasHarris_potrait.jpg", alt: "Thomas Harris" },
    { src: "/images/Sapiens.jpg", alt: "Sapiens" },
    { src: "/images/June Hur_portrait.jpg", alt: "June Hur" },
    { src: "/images/MatBiec.jpg", alt: "Mắt Biếc" },
    { src: "/images/PauloCoelho_portrait.jpg", alt: "Paulo Coelho" },
    { src: "/images/NormalPeople.jpg", alt: "Normal People" },
  ];

  const [imageOrder, setImageOrder] = useState(images);
  const [highRatedBooks, setHighRatedBooks] = useState([]);
  const [BookData, setBookData] = useState([]);
  const [favAuthors, setFavAuthors] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageOrder((prevOrder) => {
        const newOrder = [...prevOrder];
        const firstImage = newOrder.shift();
        newOrder.push(firstImage);
        return newOrder;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const options = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (highRatedBooksRef.current) {
      observer.observe(highRatedBooksRef.current);
    }
    if (favAuthorsRef.current) {
      observer.observe(favAuthorsRef.current);
    }

    return () => {
      if (highRatedBooksRef.current) {
        observer.unobserve(highRatedBooksRef.current);
      }
      if (favAuthorsRef.current) {
        observer.unobserve(favAuthorsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/api/books/gettop3booksbyrating', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setHighRatedBooks(response.data || []); // Default to empty array if response.data is undefined
        setBookData(response.data || []);
      })
      .catch(error => {
        console.error('Error fetching top rated books:', error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/api/authors/gettop3authors', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setFavAuthors(response.data || []); // Default to empty array if response.data is undefined
      })
      .catch(error => {
        console.error('Error fetching top authors:', error);
      });
  }, []);

  return (
    <div className={styles.LandingPage}>
      <section className={styles.body}>
        <div className={styles.intro}>
          <div className={styles.welcome}>
            <div className={styles.introCon}>
              <h2>
                <span className={styles.bookaboo}>Bookaboo</span> <br />
                lan tỏa văn hóa đọc và kết nối cộng đồng yêu sách
              </h2>
            </div>
            <div className={styles.linkCon}>
              <p>
                Bạn đã sẵn sàng khám phá?{" "}
                <Link to="/DangK">Đăng ký</Link>
              </p>
              <p>
                Đã là thành viên?{" "}
                <Link to="/dang-nhap">Đăng nhập</Link>
              </p>
            </div>
          </div>

          <div className={styles.wall}>
            {imageOrder.map((image, index) => (
              <div key={index} className={styles.block}>
                <img src={image.src} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>

        <section className={`${styles.highRatedBooks} ${styles.hidden}`} ref={highRatedBooksRef}>
          <div className={styles.heading}>
            <h2>Sách được <span style={{ backgroundColor: "var(--color-khaki)" }}>đánh giá cao</span></h2>
          </div>
          <div className={styles.BcardContainer}>
            {highRatedBooks.map((book, index) => (
              <Link
                key={index}
                to={`/sach/${book.TieuDe}`} 
                className={`${styles.bookcard} ${styles[`bookcard${index + 1}`]}`}
              >
                <div className={styles.bookCover}>
                  <img src={`/images/${book.AnhBia}`} alt={book.TieuDe} />
                </div>
                <div className={styles.bookInfo}>
                  <div className={styles.title}>
                    <h3>{book.TieuDe}</h3>
                  </div>
                  <div className={styles.author}>
                    <h4>{book.TacGia && book.TacGia.length > 0 ? book.TacGia[0].HoTen : "Unknown Author"}</h4>
                  </div>
                  <div className={styles.rating}>
                    <h4>
                      {book.DanhGia && book.DanhGia.length > 0 ? 
                        (book.DanhGia.reduce((sum, review) => sum + (review.SoDiem || 0), 0) / book.DanhGia.length).toFixed(1) 
                        : "No Rating"}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={`${styles.favAuthors} ${styles.hidden}`} ref={favAuthorsRef}>
          <div className={styles.heading}>
            <h2>Tác giả được <span style={{ backgroundColor: "rgb(255, 208, 208)" }}>yêu thích</span></h2>
          </div>
          <div className={styles.AcardContainer}>
            {favAuthors.map((author, index) => (
              <Link
                key={index}
                to={`/authorspotlight/${author.HoTen}`} 
                className={styles.authorCard}
              >
                <div className={styles.authorPic}>
                  <img src={`/images/${author.AnhTacGia}`} alt={author.HoTen} /> 
                </div>
                <div className={styles.authorNameOverlay}>
                  <h4>{author.HoTen}</h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
