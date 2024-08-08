import React, { useEffect, useState } from "react";
import axios from "axios";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Setting from "../components/Setting";
import Footer from "../components/Footer";
import styles from "./AdminDeleteBook.module.css";

const XaGnYSch = () => {
  const [books, setBooks] = useState([]);
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/books/getallbooksvaluezero', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
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

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedBooks.map(async (book) => {
        const response = await axios.delete(`http://localhost:3000/api/books/deletebook/${book.ID}`);
        console.log(response.data);
      }));
      fetchBooks();
      setSelectedBooks([]);
      alert('Xóa sách thành công!');
    } catch (error) {
      console.error('Error deleting books:', error);
      alert('Có lỗi xảy ra khi xóa sách.');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete('http://localhost:3000/api/books/deleteallbooks');
      console.log(response.data);
      fetchBooks();
      alert('Xóa tất cả sách thành công!');
    } catch (error) {
      console.error('Error deleting all books:', error);
      alert('Có lỗi xảy ra khi xóa tất cả sách.');
    }
  };

  const handleRestoreSelected = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(selectedBooks.map(async (book) => {
        await axios.put('http://localhost:3000/api/books/changevalueofbooktorestore', {
          id: book.ID,
          giatri: 1
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchBooks();
      setSelectedBooks([]);
      alert('Khôi phục sách thành công!');
    } catch (error) {
      console.error('Error restoring books:', error);
      alert('Có lỗi xảy ra khi khôi phục sách.');
    }
  };

  const handleRestoreAll = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(books.map(async (book) => {
        await axios.put('http://localhost:3000/api/books/changevalueofallbookstorestore', {
          giatri: 1
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchBooks();
      alert('Khôi phục tất cả sách thành công!');
    } catch (error) {
      console.error('Error restoring all books:', error);
      alert('Có lỗi xảy ra khi khôi phục tất cả sách.');
    }
  };
  
  return (
    <div className={styles.admindaxoagandaysach}>
      <TopNavMana />
      <section className={styles.container}>
        <PanelDefault />
        <section className={styles.container1}>
          <div className={styles.xaGnYParent}>
            <div className={styles.xaGnY}>Đã xóa gần đây</div>
            <div className={styles.searching}>
              <textarea className={styles.textbox} placeholder="[text]" />
              <div className={styles.search}>
                <img className={styles.searchIcon} alt="" src="/search1.svg" />
              </div>
            </div>
          </div>
          <Setting onToggleCheckboxColumn={handleToggleCheckboxColumn} />
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}><div className={styles.stt}>STT</div></th>
                <th className={styles.th}><div className={styles.id}>ID</div></th>
                <th className={styles.th}><div className={styles.ten}>Tên sách</div></th>
                <th className={styles.th}><div className={styles.tcGi}>Tác giả</div></th>
                <th className={styles.th}><div className={styles.anh}>Ảnh</div></th>
                {showCheckboxColumn && (
                  <th className={styles.th}>
                    <div className={styles.checkboxHeader}></div> {/* Header của cột chọn */}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book._id}>
                  <td className={styles.th}><div className={styles.text}>{index + 1}</div></td>
                  <td className={styles.th}><div className={styles.text}>{book.ID}</div></td>
                  <td className={styles.th}><div className={styles.text}>{book.TieuDe}</div></td>
                  <td className={styles.th}><div className={styles.text}>{book.TacGia}</div></td>
                  <td className={styles.th}>
                    <div className={styles.imageContainer}>
                      <img className={styles.bookImage} src={`/images/${book.AnhBia}`} alt={book.TieuDe} />
                    </div>
                  </td>
                  {showCheckboxColumn && (
                    <td className={styles.th}>
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
            <div className={styles.buttoncontainer}>
              <div className={styles.deleteButton}>
                {/* <button className={styles.xaTtC} onClick={handleDeleteAll}>Xóa tất cả</button>
                <button className={styles.xaTtC} onClick={handleDeleteSelected}>Xóa</button> */}
              </div>
              <div className={styles.restoreButton}>
                <button className={styles.xaTtC} onClick={handleRestoreAll}>Khôi phục tất cả</button>
                <button className={styles.xaTtC} onClick={handleRestoreSelected}>Khôi phục</button>
              </div>
            </div>
            <div className={styles.pagenav}>
              <button className={styles.back}>
                <img className={styles.arrowBackIosIcon} alt="" src="/arrow-back-ios@2x.png" />
              </button>
              <div className={styles.page}>1/2</div>
              <button className={styles.back}>
                <img className={styles.arrowForwardIosIcon} alt="" src="/arrow-forward-ios@2x.png" />
              </button>
            </div>
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
};

export default XaGnYSch;
