import React, { useEffect, useState } from "react";
import axios from "axios";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Setting from "../components/Setting";
import Footer from "../components/Footer";
import styles from "./AdminDeleteAccount.module.css";

const XaGnYTiKhon = () => {
  const [accounts, setAccounts] = useState([]);
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/users/getallusersvaluezero', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
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

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedAccounts.map(async (account) => {
        const response = await axios.delete(`http://localhost:3000/api/users/deleteuser/${account.ID}`);
        console.log(response.data);
      }));
      fetchAccounts();
      setSelectedAccounts([]);
      alert('Xóa tài khoản thành công!');
    } catch (error) {
      console.error('Error deleting accounts:', error);
      alert('Có lỗi xảy ra khi xóa tài khoản.');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete('http://localhost:3000/api/users/deleteallusers');
      console.log(response.data);
      fetchAccounts();
      alert('Xóa tất cả tài khoản thành công!');
    } catch (error) {
      console.error('Error deleting all accounts:', error);
      alert('Có lỗi xảy ra khi xóa tất cả tài khoản.');
    }
  };

  const handleRestoreSelected = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(selectedAccounts.map(async (account) => {
        await axios.put('http://localhost:3000/api/users/changevalueofusertorestore', {
          id: account.ID,
          giatri: 1
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchAccounts();
      setSelectedAccounts([]);
      alert('Khôi phục tài khoản thành công!');
    } catch (error) {
      console.error('Error restoring accounts:', error);
      alert('Có lỗi xảy ra khi khôi phục tài khoản.');
    }
  };

  const handleRestoreAll = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(accounts.map(async (account) => {
        await axios.put('http://localhost:3000/api/users/changevalueofalluserstorestore', {
          giatri: 1
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchAccounts();
      alert('Khôi phục tất cả tài khoản thành công!');
    } catch (error) {
      console.error('Error restoring all accounts:', error);
      alert('Có lỗi xảy ra khi khôi phục tất cả tài khoản.');
    }
  };

  return (
    <div className={styles.admindaxoagandaytaikhoan}>
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
                <th className={styles.th}><div className={styles.tnNgiDng}>Tên người dùng</div></th>
                <th className={styles.th}><div className={styles.email}>Email</div></th>
                <th className={styles.th}><div className={styles.khuVc}>Khu vực</div></th>
                <th className={styles.th}><div className={styles.ngyThm}>Ngày tạo</div></th>
                {showCheckboxColumn && (
                  <th className={styles.th}>
                    <div className={styles.checkboxHeader}></div> {/* Header của cột chọn */}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={account._id}>
                  <td className={styles.th}><div className={styles.text}>{index + 1}</div></td>
                  <td className={styles.th}><div className={styles.text}>{account.ID}</div></td>
                  <td className={styles.th}><div className={styles.text}>{account.TenTaiKhoan}</div></td>
                  <td className={styles.th}>
                    <div className={styles.text}>
                      <a href={`mailto:${account.Email}`}>{account.Email}</a>
                    </div>
                  </td>
                  <td className={styles.th}><div className={styles.text}>{account.ThanhPho}</div></td>
                  <td className={styles.th}><div className={styles.text}>{account.NgayTao}</div></td>
                  {showCheckboxColumn && (
                    <td className={styles.th}>
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

export default XaGnYTiKhon;
