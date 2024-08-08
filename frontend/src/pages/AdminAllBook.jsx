import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Setting from "../components/Setting";
import Footer from "../components/Footer";
import styles from "./AdminAllBook.module.css";

const SchTtC = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false); // State để điều khiển hiển thị cột checkbox
  const [selectedBooks, setSelectedBooks] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  useEffect(() => {
    fetchAllBooks();
  }, []);

  useEffect(() => {
    updatePageInfo();
  }, [pathname]);

  const fetchAllBooks = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/books/getallbooks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSearchedBooks = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/books/searchbooks', {
        params: { query },
        headers: {Authorization: `Bearer ${token}`},
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updatePageInfo = () => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/adminbookall":
        title = "Danh sách sách - Admin";
        metaDescription = "Xem và quản lý danh sách sách của admin";
        break;
      default:
        title = "Trang quản trị";
        metaDescription = "Trang quản trị hệ thống";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector('head > meta[name="description"]');
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  };

  const handleSearch = (event) => {
    if (event.type === 'click' || (event.type === 'keypress' && event.key === 'Enter')) {
      fetchSearchedBooks();
    }
  };

  const handleBookClick = (book) => {
    navigate(`/adminbookadd?id=${book.ID}&title=${book.TieuDe}&author=${book.TacGia.map(author => author.HoTen).join(', ')}&category=${book.TheLoai.join(', ')}&publishdate=${book.NgayXB}&covertype=${book.LoaiBia}&language=${book.NgonNgu}&page=${book.SoTrang}&context=${book.BoiCanh}&summary=${book.TomTat}&cover=${book.AnhBia}`);
  };

  const handleToggleCheckboxColumn = (showColumn) => {
    setShowCheckboxColumn(showColumn);
  };

  const handleCheckboxChange = (event, book) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedBooks(prevSelected => [...prevSelected, book]);
    } else {
      setSelectedBooks(prevSelected => prevSelected.filter(selectedBook => selectedBook.ID !== book.ID));
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(selectedBooks.map(async (book) => {
        await axios.put('http://localhost:3000/api/books/changevalueofbooktodelete', {
          id: book.ID,
          giatri: 0
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      // Fetch all books again to reflect the changes
      fetchAllBooks();
      // Clear the selected books
      setSelectedBooks([]);
      // Show success alert
      alert('Xóa sách thành công');
    } catch (error) {
      console.error('Error updating books:', error);
      // Show failure alert
      alert('Xóa sách thất bại');
    }
  };

  const handleDeleteAll = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(books.map(async (book) => {
        await axios.put('http://localhost:3000/api/books/changevalueofallbookstodelete', {
          giatri: 0
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      // Fetch all books again to reflect the changes
      fetchAllBooks();
      // Show success alert
      alert('Xóa tất cả sách thành công');
    } catch (error) {
      console.error('Error deleting all books:', error);
      // Show failure alert
      alert('Xóa tất cả sách thất bại');
    }
  };

  return (
    <div className={styles.adminbookall}>
      <TopNavMana />
      <section className={styles.container}>
        <PanelDefault />
        <section className={styles.container1}>
          <div className={styles.dLiuSchParent}>
            <div className={styles.dLiuSch}>Dữ liệu sách</div>
            <div className={styles.searching}>
              <input 
                className={styles.textbox} 
                placeholder="Nhập ID / Tên sách / Tác giả của sách muốn tìm kiếm" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
              <div className={styles.search} onClick={handleSearch}>
                <img className={styles.searchIcon} alt="" src="/search1.svg" />
              </div>
            </div>
          </div>
          <Setting className={styles.settingComponent} onToggleCheckboxColumn={handleToggleCheckboxColumn} />
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>
                  <div className={styles.stt}>STT</div>
                </th>
                <th className={styles.th}>
                  <div className={styles.id}>ID</div>
                </th>
                <th className={styles.th}>
                  <div className={styles.ten}>Tên sách</div>
                </th>
                <th className={styles.th}>
                  <div className={styles.tcGi}>Tác giả</div>
                </th>
                <th className={styles.th}>
                  <div className={styles.ngThem}>Ảnh bìa sách</div>
                </th>
                {showCheckboxColumn && (
                  <th className={styles.th}>
                    <div className={styles.checkboxHeader}></div> {/* Header của cột chọn */}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.ID}>
                  <td className={styles.td}>
                    <div className={styles.text}>{index + 1}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleBookClick(book)}>
                    <div className={styles.text}>{book.ID}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleBookClick(book)}>
                    <div className={styles.text}>{book.TieuDe}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleBookClick(book)}>
                    <div className={styles.text}>{book.TacGia.map(author => author.HoTen).join(', ')}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleBookClick(book)}>
                    <div className={styles.text}>
                      <img className={styles.coverImage} src={`/images/${book.AnhBia}`} alt={book.TieuDe} />
                    </div>
                  </td>
                  {showCheckboxColumn && (
                    <td className={styles.td}>
                      <input
                        type="checkbox"
                        checked={selectedBooks.some(selectedBook => selectedBook.ID === book.ID)}
                        onChange={(event) => handleCheckboxChange(event, book)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.buttoncon}>
            <div className={styles.deleteButton}>
              <button className={styles.xaTtC} onClick={handleDeleteAll}>Xóa tất cả</button>
              <button className={styles.xaTtC} onClick={handleDelete}>Xóa</button>
            </div>
            <div className={styles.pagenav}>
              <button className={styles.back}>
                <img
                  className={styles.arrowBackIosIcon}
                  alt=""
                  src="/arrow-back-ios@2x.png"
                />
              </button>
              <div className={styles.page}>1/2</div>
              <button className={styles.back}>
                <img
                  className={styles.arrowForwardIosIcon}
                  alt=""
                  src="/arrow-forward-ios@2x.png"
                />
              </button>
            </div>
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
};

export default SchTtC;
