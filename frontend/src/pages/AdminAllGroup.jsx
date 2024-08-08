import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from "date-fns"; 
import { useLocation, useNavigate } from "react-router-dom";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Setting from "../components/Setting";
import Footer from "../components/Footer";
import styles from "./AdminAllGroup.module.css";

const NhmTtC = () => {
  const [groups, setGroups] = useState([]);
  const [query, setQuery] = useState("");
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false); // State to control checkbox column visibility
  const [selectedGroups, setSelectedGroups] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  useEffect(() => {
    fetchAllGroups();
  }, []);

  useEffect(() => {
    updatePageInfo();
  }, [pathname]);

  const fetchAllGroups = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/groups/getallgroups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSearchedGroups = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/groups/searchgroups', {
        params: { query },
        headers: {Authorization: `Bearer ${token}`},
      });
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updatePageInfo = () => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/admingroupall":
        title = "Danh sách nhóm - Admin";
        metaDescription = "Xem và quản lý danh sách nhóm của admin";
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
      fetchSearchedGroups();
    }
  };

  const handleGroupClick = (group) => {
    navigate(`/admingroupadd?id=${group.ID}&name=${group.TenNhom}&admin=${group.QuanTriVien.map(admin => admin.HoTen).join(', ')}&description=${group.GioiThieu}&avatar=${group.AnhDaiDien}`);
  };

  const handleToggleCheckboxColumn = (showColumn) => {
    setShowCheckboxColumn(showColumn);
  };

  const handleCheckboxChange = (event, group) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedGroups(prevSelected => [...prevSelected, group]);
    } else {
      setSelectedGroups(prevSelected => prevSelected.filter(selectedGroup => selectedGroup.ID !== group.ID));
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(selectedGroups.map(async (group) => {
        await axios.put('http://localhost:3000/api/groups/changevalueofgrouptodelete', {
          id: group.ID,
          giatri: 0
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchAllGroups();
      setSelectedGroups([]);
      alert('Xóa nhóm thành công');
    } catch (error) {
      console.error('Error updating groups:', error);
      alert('Xóa nhóm thất bại');
    }
  };

  const handleDeleteAll = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(groups.map(async (group) => {
        await axios.put('http://localhost:3000/api/groups/changevalueofallgroupstodelete', {
          giatri: 0
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchAllGroups();
      alert('Xóa tất cả nhóm thành công');
    } catch (error) {
      console.error('Error deleting all groups:', error);
      alert('Xóa tất cả nhóm thất bại');
    }
  };

  return (
    <div className={styles.admingroupall}>
      <TopNavMana />
      <section className={styles.container}>
        <PanelDefault />
        <section className={styles.container1}>
          <div className={styles.dLiuNhmParent}>
            <div className={styles.dLiuNhm}>Dữ liệu nhóm</div>
            <div className={styles.searching}>
              <input 
                className={styles.textbox} 
                placeholder="Nhập Tên nhóm / ID của nhóm muốn tìm kiếm" 
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
                  <div className={styles.tnNhm}>Tên nhóm</div>
                </th>
                <th className={styles.th}>
                  <div className={styles.qunTrVin}>Quản trị viên</div>
                </th>
                <th className={styles.th}>
                  <div className={styles.ngThem}>Ngày tạo</div>
                </th>
                {showCheckboxColumn && (
                  <th className={styles.th}>
                    <div className={styles.checkboxHeader}></div> {/* Header of the checkbox column */}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr key={group.ID}>
                  <td className={styles.td}>
                    <div className={styles.text}>{index + 1}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleGroupClick(group)}>
                    <div className={styles.text}>{group.ID}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleGroupClick(group)}>
                    <div className={styles.text}>{group.TenNhom}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleGroupClick(group)}>
                    <div className={styles.text}>{group.QuanTriVien.map(admin => admin.HoTen).join(', ')}</div>
                  </td>
                  <td className={styles.td} style={{cursor: 'pointer'}} onClick={() => handleGroupClick(group)}>
                    <div className={styles.text}>{group ? format(new Date(group.NgayTao),  "dd/MM/yyyy") : "Loading..."}</div>
                  </td>
                  {showCheckboxColumn && (
                    <td className={styles.td}>
                      <input
                        type="checkbox"
                        checked={selectedGroups.some(selectedGroup => selectedGroup.ID === group.ID)}
                        onChange={(event) => handleCheckboxChange(event, group)}
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

export default NhmTtC;
