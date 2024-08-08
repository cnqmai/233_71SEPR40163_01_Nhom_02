import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from "date-fns"; 
import { useLocation, useNavigate } from "react-router-dom";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Setting from "../components/Setting";
import Footer from "../components/Footer";
import styles from "./AdminAllAccount.module.css";

const TiKhonTtC = () => {
  const [accounts, setAccounts] = useState([]);
  const [query, setQuery] = useState("");
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  useEffect(() => {
    fetchAllAccounts();
  }, []);

  useEffect(() => {
    updatePageInfo();
  }, [pathname]);

  const fetchAllAccounts = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/users/getallusers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSearchedAccounts = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/users/searchusers', {
        params: { query },
        headers: {Authorization: `Bearer ${token}`},
      });
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updatePageInfo = () => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/adminaccountall":
        title = "Danh sách tài khoản - Admin";
        metaDescription = "Xem và quản lý danh sách tài khoản của admin";
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
      fetchSearchedAccounts();
    }
  };

  const handleAccountClick = (account) => {
    navigate(`/adminaccountadd?id=${account.ID}&username=${account.TenTaiKhoan}&fullname=${account.HoTen}&password=${account.MatKhau}&email=${account.Email}&birthdate=${account.NgaySinh}&createdate=${account.NgayTao}&gender=${account.GioiTinh}&intro=${account.GioiThieu}&region=${account.ThanhPho}&hobbies=${account.SoThich}&avatar=${account.AnhDaiDien}`);
  };

  const handleToggleCheckboxColumn = (showColumn) => {
    setShowCheckboxColumn(showColumn);
  };

  const handleCheckboxChange = (event, account) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedAccounts(prevSelected => [...prevSelected, account]);
    } else {
      setSelectedAccounts(prevSelected => prevSelected.filter(selectedAccount => selectedAccount.ID !== account.ID));
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(selectedAccounts.map(async (account) => {
        await axios.put('http://localhost:3000/api/users/changevalueofusertodelete', {
          id: account.ID,
          giatri: 0
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchAllAccounts();
      setSelectedAccounts([]);
      alert('Xóa tài khoản thành công');
    } catch (error) {
      console.error('Error deleting accounts:', error);
      alert('Xóa tài khoản thất bại');
    }
  };

  const handleDeleteAll = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(accounts.map(async (account) => {
        await axios.put('http://localhost:3000/api/users/changevalueofalluserstodelete', {
          giatri: 0
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchAllAccounts();
      alert('Xóa tất cả tài khoản thành công');
    } catch (error) {
      console.error('Error deleting all accounts:', error);
      alert('Xóa tất cả tài khoản thất bại');
    }
  };

  return (
    <div className={styles.adminaccountall}>
      <TopNavMana />
      <section className={styles.container}>
        <PanelDefault />
        <section className={styles.container1}>
          <div className={styles.dLiuTiKhonParent}>
            <div className={styles.dLiuTi}>Dữ liệu tài khoản</div>
            <div className={styles.searching}>
              <input 
                className={styles.textbox} 
                placeholder="Nhập ID / Tên tài khoản / Họ tên người dùng muốn tìm kiếm" 
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
                  <div className={styles.tnNgiDng}>Tên người dùng</div>
                </th>
                <th className={styles.th}>
                  <div className={styles.email}>Email</div>
                </th>
                <th className={styles.th}>
                  <div className={styles.khuVc}>Khu vực</div>
                </th>
                <th className={styles.th}>
                  <div className={styles.ngyT}>Ngày tạo</div>
                </th>
                {showCheckboxColumn && (
                  <th className={styles.th}>
                    <div className={styles.checkboxHeader}></div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={account.ID}>
                  <td className={styles.td}>
                    <div className={styles.text}>{index + 1}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleAccountClick(account)}>
                    <div className={styles.text}>{account.ID}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleAccountClick(account)}>
                    <div className={styles.text}>{account.TenTaiKhoan}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleAccountClick(account)}>
                    <div className={styles.text}>{account.Email}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleAccountClick(account)}>
                    <div className={styles.text}>{account.ThanhPho}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleAccountClick(account)}>
                    <div className={styles.text}>{account ? format(new Date(account.NgayTao),  "dd/MM/yyyy") : "Loading..."}</div>
                  </td>
                  {showCheckboxColumn && (
                    <td className={styles.td}>
                      <input
                        type="checkbox"
                        checked={selectedAccounts.some(selectedAccount => selectedAccount.ID === account.ID)}
                        onChange={(event) => handleCheckboxChange(event, account)}
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

export default TiKhonTtC;
