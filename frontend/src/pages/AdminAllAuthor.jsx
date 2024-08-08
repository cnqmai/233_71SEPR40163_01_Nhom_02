import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Setting from "../components/Setting";
import Footer from "../components/Footer";
import styles from "./AdminAllAuthor.module.css";

const TcGiTtC = () => {
  const [authors, setAuthors] = useState([]);
  const [query, setQuery] = useState("");
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false); // State để điều khiển hiển thị cột checkbox
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  useEffect(() => {
    fetchAllAuthors();
  }, []);

  useEffect(() => {
    updatePageInfo();
  }, [pathname]);

  const fetchAllAuthors = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/authors/getallauthors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSearchedAuthors = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/authors/searchauthors', {
        params: { query },
        headers: {Authorization: `Bearer ${token}`},
      });
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updatePageInfo = () => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/adminauthorall":
        title = "Danh tác giả tác giả - Admin";
        metaDescription = "Xem và quản lý danh tác giả tác giả của admin";
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
      fetchSearchedAuthors();
    }
  };

  const handleAuthorClick = (author) => {
    navigate(`/adminauthoradd?id=${author.ID}&name=${author.HoTen}&birthdate=${author.NgaySinh}&birthplace=${author.NoiSinh}&introduction=${author.GioiThieu}&works=${author.TacPham.map(book => book.TieuDe).join(', ')}&image=${author.AnhTacGia}`);
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

  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(selectedAuthors.map(async (author) => {
        await axios.put('http://localhost:3000/api/authors/changevalueofauthortodelete', {
          id: author.ID,
          giatri: 0
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      // Fetch all authors again to reflect the changes
      fetchAllAuthors();
      // Clear the selected authors
      setSelectedAuthors([]);
      // Show success alert
      alert('Xóa tác giả thành công');
    } catch (error) {
      console.error('Error deleting author:', error);
      // Show failure alert
      alert('Xóa tác giả thất bại');
    }
  };

  const handleDeleteAll = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(authors.map(async (author) => {
        await axios.put('http://localhost:3000/api/authors/changevalueofallauthorstodelete', {
          giatri: 0
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      // Fetch all authors again to reflect the changes
      fetchAllAuthors();
      // Show success alert
      alert('Xóa tất cả tác giả thành công');
    } catch (error) {
      console.error('Error deleting all authors:', error);
      // Show failure alert
      alert('Xóa tất cả tác giả thất bại');
    }
  };

  return (
    <div className={styles.adminauthorall}>
      <TopNavMana />
      <section className={styles.container}>
        <PanelDefault />
        <section className={styles.container1}>
          <div className={styles.dLiuTcGiParent}>
            <div className={styles.dLiuTc}>Dữ liệu tác giả</div>
            <div className={styles.searching}>
              <input 
                className={styles.textbox} 
                placeholder="Nhập Tên tác giả / ID của tác giả muốn tìm kiếm" 
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
                  <div className={styles.tnTcGi}>Tên tác giả</div>
                </th> 
                <th className={styles.th}>
                  <div className={styles.ngSinh}>Ngày sinh</div>
                </th> 
                <th className={styles.th}>
                  <div className={styles.niSinh}>Nơi sinh</div>  
                </th> 
                <th className={styles.th}>
                  <div className={styles.ngThem}>Ảnh tác giả</div>
                </th>
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
                  <td className={styles.th}>
                    <div className={styles.text}>{index + 1}</div>
                  </td>
                  <td className={styles.th} style={{ cursor: 'pointer' }} onClick={() => handleAuthorClick(author)}>
                    <div className={styles.text}>{author.ID}</div>
                  </td>
                  <td className={styles.th} style={{ cursor: 'pointer' }} onClick={() => handleAuthorClick(author)}>
                    <div className={styles.text}>{author.HoTen}</div>
                  </td>
                  <td className={styles.th} style={{ cursor: 'pointer' }} onClick={() => handleAuthorClick(author)}>
                    <div className={styles.text}>{author.NgaySinh}</div>
                  </td>
                  <td className={styles.th} style={{ cursor: 'pointer' }} onClick={() => handleAuthorClick(author)}>
                    <div className={styles.text}>{author.NoiSinh}</div>
                  </td>
                  <td className={styles.th} style={{ cursor: 'pointer' }} onClick={() => handleAuthorClick(author)}>
                    <div className={styles.text}>
                      <img className={styles.authorImage} src={`/images/${author.AnhTacGia}`} alt={author.HoTen} />
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

export default TcGiTtC;
