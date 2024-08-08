import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopNavDisc from "../components/TopNavDiscFocus";
import TcPhm from "../components/TcPhm";
import Footer from "../components/Footer";
import styles from "./Author.module.css";

const Author = () => {
  const { name } = useParams(); // Lấy tên tác giả từ URL
  const [authorData, setAuthorData] = useState(null); // State để lưu trữ dữ liệu tác giả
  const [books, setBooks] = useState([]); 

  useEffect(() => {
    const scrollAnimElements = document.querySelectorAll(
      "[data-animate-on-scroll]"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            const targetElement = entry.target;
            targetElement.classList.add(styles.animate);
            observer.unobserve(targetElement);
          }
        }
      },
      {
        threshold: 0.15,
      }
    );

    for (let i = 0; i < scrollAnimElements.length; i++) {
      observer.observe(scrollAnimElements[i]);
    }

    return () => {
      for (let i = 0; i < scrollAnimElements.length; i++) {
        observer.unobserve(scrollAnimElements[i]);
      }
    };
  }, []);

  useEffect(() => {
    const fetchAuthorData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`http://localhost:3000/api/authors/getauthorbyname/${name}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAuthorData(data);
        setBooks(data.TacPham.slice(0, 4)); // Lấy tối đa 4 sách
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    };

    fetchAuthorData();
  }, [name]);

  if (!authorData) {
    return <div>Loading...</div>; // Hiển thị thông báo tải nếu dữ liệu chưa được tải
  }

  return (
    <div className={styles.tacgia} data-animate-on-scroll>
      <TopNavDisc />
      <main className={styles.body}>
        <section className={styles.thngTinTcGi}>
          <h1 className={styles.authorsName}>{authorData.HoTen || "Author Name"}</h1>
          <img
            className={styles.AuthorsImg}
            alt={authorData.HoTen}
            src={`/images/${authorData.AnhTacGia}`}
          />
          <div className={styles.authorsInfo}>
            <div className={styles.bornin}>
              <div className={styles.heading}>Born in</div>
              <div className={styles.textContainer}>
                <p className={styles.text}>{authorData.NoiSinh}</p>
                <p className={styles.text}>{authorData.NgaySinh}</p>
              </div>
            </div>

            <div className={styles.website}>
              <div className={styles.heading}>Website</div>
              <div className={styles.textContainer}>
                <a
                  className={styles.text}
                  href={authorData.Website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {authorData.Website || "N/A"}
                </a>
              </div>
            </div>

            <div className={styles.genre}>
              <div className={styles.heading}>Genre</div>
              <div className={styles.textContainer}>
                <p className={styles.text}>
                  {Array.isArray(authorData.TheLoai) ? authorData.TheLoai.join(", ") : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.descriptionContainer}>
            <div className={styles.description}>
              {authorData.GioiThieu
                ? authorData.GioiThieu.split("\n").map((paragraph, index) => (
                    <p key={index} className={styles.text}>
                      <br></br>
                      {paragraph}
                    </p>
                  ))
                : <p className={styles.text}>{authorData.GioiThieu}</p>}
            </div>
          </div>
        </section>
        <TcPhm books={books} />
      </main>
      <Footer bookabooMargin="0" vChngTiFontSize="16px" bnQuynFontSize="16px" />
    </div>
  );
};

export default Author;
