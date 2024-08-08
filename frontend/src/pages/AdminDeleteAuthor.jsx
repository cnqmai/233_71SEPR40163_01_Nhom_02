import React, { useEffect, useState } from "react";
import axios from "axios";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Setting from "../components/Setting";
import Footer from "../components/Footer";
import styles from "./AdminDeleteAuthor.module.css";

const XaGnYTcGi = () => {
  const [authors, setAuthors] = useState([]);
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/authors/getallauthorsvaluezero', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAuthors(response.data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  const handleToggleCheckboxColumn = (showColumn) => {
    setShowCheckboxColumn(showColumn);
  };

  const handleCheckboxChange = (event, author) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedAuthors(prevSelected => [...prevSelected, author]);
    } else {
      setSelectedAuthors(prevSelected => prevSelected.filter(selectedAuthor => selectedAuthor.ID !== author.ID));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedAuthors.map(async (author) => {
        const response = await axios.delete(`http://localhost:3000/api/authors/deleteauthor/${author.ID}`);
        console.log(response.data);
      }));
      fetchAuthors();
      setSelectedAuthors([]);
      alert('Xóa tác giả thành công!');
    } catch (error) {
      console.error('Error deleting authors:', error);
      alert('Có lỗi xảy ra khi xóa tác giả.');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete('http://localhost:3000/api/authors/deleteallauthors');
      console.log(response.data);
      fetchAuthors();
      alert('Xóa tất cả tác giả thành công!');
    } catch (error) {
      console.error('Error deleting all authors:', error);
      alert('Có lỗi xảy ra khi xóa tất cả tác giả.');
    }
  };

  const handleRestoreSelected = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(selectedAuthors.map(async (author) => {
        await axios.put('http://localhost:3000/api/authors/changevalueofauthortorestore', {
          id: author.ID,
          giatri: 1 
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchAuthors();
      setSelectedAuthors([]);
      alert('Khôi phục tác giả thành công!');
    } catch (error) {
      console.error('Error restoring authors:', error);
      alert('Có lỗi xảy ra khi khôi phục tác giả.');
    }
  };

  const handleRestoreAll = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(authors.map(async (author) => {
        await axios.put('http://localhost:3000/api/authors/changevalueofallauthorstorestore', { 
          giatri: 1 
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchAuthors();
      alert('Khôi phục tất cả tác giả thành công!');
    } catch (error) {
      console.error('Error restoring all authors:', error);
      alert('Có lỗi xảy ra khi khôi phục tất cả tác giả.');
    }
  };

  return (
    <div className={styles.admindaxoagandaytacgia}>
      <TopNavMana />
      <section className={styles.container}>
        <PanelDefault />
        <div className={styles.container1}>
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
                <th className={styles.th}><div className={styles.tnNgiDng}>Tên tác giả</div></th>
                <th className={styles.th}><div className={styles.email}>Ngày sinh</div></th>
                <th className={styles.th}><div className={styles.khuVc}>Nơi sinh</div></th>
                <th className={styles.th}><div className={styles.ngThem}>Ảnh tác giả</div></th>
                {showCheckboxColumn && (
                  <th className={styles.th}>
                    <div className={styles.checkboxHeader}></div> {/* Header của cột chọn */}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {authors.map((author, index) => (
                <tr key={author.ID}>
                  <td className={styles.th}><div className={styles.text}>{index + 1}</div></td>
                  <td className={styles.th}><div className={styles.text}>{author.ID}</div></td>
                  <td className={styles.th}><div className={styles.text}>{author.HoTen}</div></td>
                  <td className={styles.th}><div className={styles.text}>{author.NgaySinh}</div></td>
                  <td className={styles.th}><div className={styles.text}>{author.NoiSinh}</div></td>
                  <td className={styles.th}>
                    <div className={styles.imageContainer}>
                      <img className={styles.authorImage} src={`/images/${author.AnhTacGia}`} alt={author.TieuDe} />
                    </div>
                  </td>
                  {showCheckboxColumn && (
                    <td className={styles.th}>
                      <input
                        type="checkbox"
                        checked={selectedAuthors.some(selectedAuthor => selectedAuthor.ID === author.ID)}
                        onChange={(event) => handleCheckboxChange(event, author)}
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
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default XaGnYTcGi;
