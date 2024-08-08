import React, { useEffect, useState } from "react";
import axios from "axios";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Setting from "../components/Setting";
import Footer from "../components/Footer";
import styles from "./AdminDeleteGroup.module.css";

const XaGnYNhm = () => {
  const [groups, setGroups] = useState([]);
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/groups/getallgroupsvaluezero', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
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

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedGroups.map(async (group) => {
        const response = await axios.delete(`http://localhost:3000/api/groups/deletegroup/${group.ID}`);
        console.log(response.data);
      }));
      fetchGroups();
      setSelectedGroups([]);
      alert('Xóa nhóm thành công!');
    } catch (error) {
      console.error('Error deleting groups:', error);
      alert('Có lỗi xảy ra khi xóa nhóm.');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete('http://localhost:3000/api/groups/deleteallgroups');
      console.log(response.data);
      fetchGroups();
      alert('Xóa tất cả nhóm thành công!');
    } catch (error) {
      console.error('Error deleting all groups:', error);
      alert('Có lỗi xảy ra khi xóa tất cả nhóm.');
    }
  };

  const handleRestoreSelected = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(selectedGroups.map(async (group) => {
        await axios.put('http://localhost:3000/api/groups/changevalueofgrouptorestore', {
          id: group.ID,
          giatri: 1
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchGroups();
      setSelectedGroups([]);
      alert('Khôi phục nhóm thành công!');
    } catch (error) {
      console.error('Error restoring groups:', error);
      alert('Có lỗi xảy ra khi khôi phục nhóm.');
    }
  };

  const handleRestoreAll = async () => {
    const token = localStorage.getItem('token');

    try {
      await Promise.all(groups.map(async (group) => {
        await axios.put('http://localhost:3000/api/groups/changevalueofallgroupstorestore', {
          giatri: 1
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }));
      fetchGroups();
      alert('Khôi phục tất cả nhóm thành công!');
    } catch (error) {
      console.error('Error restoring all groups:', error);
      alert('Có lỗi xảy ra khi khôi phục tất cả nhóm.');
    }
  };

  return (
    <div className={styles.admindaxoagandaynhom}>
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
                <th className={styles.th}><div className={styles.tnNhm}>Tên nhóm</div></th>
                <th className={styles.th}><div className={styles.qunTrVin}>Quản trị viên</div></th>
                <th className={styles.th}><div className={styles.ngThem}>Ngày tạo</div></th>
                {showCheckboxColumn && (
                  <th className={styles.th}>
                    <div className={styles.checkboxHeader}></div> {/* Header của cột chọn */}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr key={group._id}>
                  <td className={styles.th}><div className={styles.text}>{index + 1}</div></td>
                  <td className={styles.th}><div className={styles.text}>{group.ID}</div></td>
                  <td className={styles.th}><div className={styles.text}>{group.TenNhom}</div></td>
                  <td className={styles.th}><div className={styles.text}>{group.QuanTriVien}</div></td>
                  <td className={styles.th}><div className={styles.text}>{group.NgayTao}</div></td>
                  {showCheckboxColumn && (
                    <td className={styles.th}>
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

export default XaGnYNhm;
