import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./AuthorPageSpotlight.module.css";

const AuthorPageSpotlight = () => {
  const { name } = useParams(); // Lấy tên tác giả từ URL
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthorData = async () => {

      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:3000/api/authors/getauthorbyname/${name}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAuthor(response.data);
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    };

    fetchAuthorData();
  }, [name]);

  if (!author) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.authorPageSpotlight}>
      <main className={styles.frameParent}>
        <div className={styles.bookaboo}>
          <div className={styles.bookaboo1}>bookaboo</div>
        </div>
        <Link to={`/author/${encodeURIComponent(author.HoTen)}`} className={styles.TitleWrapper}>
          <h1 className={styles.Title}>{author.HoTen}</h1>
        </Link>
      </main>
    </div>
  );
};

export default AuthorPageSpotlight;
