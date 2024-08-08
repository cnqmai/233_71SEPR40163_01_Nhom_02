import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import TopNavCom from "../components/TopNavComFocus";
import Footer from "../components/Footer";
import styles from "./GroupSuggest.module.css";

const GroupSuggest = () => {
  const [isLeftExpanded, setLeftExpanded] = useState(true);
  const toggleLeftWidth = () => {
    setLeftExpanded((prev) => !prev);
  };
  const navigate = useNavigate();
  const { groupName, userId } = useParams(); 
  const [groupData, setGroupData] = useState(null);
  const [managedGroups, setManagedGroups] = useState([]);
  const [participatedGroups, setParticipatedGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu cho nhóm cụ thể
  const fetchGroupData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3000/api/groups/getsuggestgroups/${userId}/${groupName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroupData(response.data);
    } catch (error) {
      console.error("Failed to fetch group data", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch nhóm do người dùng quản lý
  const fetchManagedGroups = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3000/api/groups/getmanagegroups/${userId}/${groupName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setManagedGroups(response.data || []);
    } catch (error) {
      console.error("Failed to fetch managed groups", error);
    }
  };

  // Fetch nhóm mà người dùng tham gia
  const fetchParticipatedGroups = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3000/api/groups/getjoinedgroups/${userId}/${groupName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParticipatedGroups(response.data || []);
    } catch (error) {
      console.error("Failed to fetch participated groups", error);
    }
  };

  useEffect(() => {
    fetchGroupData();
    fetchManagedGroups();
    fetchParticipatedGroups();
  }, [groupName, userId]);

  const handleGroupNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const handleJoin = useCallback(async (group) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3000/api/groups/join', 
        { groupId: group._id}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Tham gia nhóm thành công!');

      fetchParticipatedGroups();
      fetchGroupData();

      navigate(`/groupsuggest/${userId}`);
    } catch (error) {
      console.error('Failed to join group', error);
      alert('Không thể tham gia nhóm.');
    }
  }, [fetchParticipatedGroups, fetchGroupData]);

  const GroupCard = ({ group, onViewClick }) => (
    <form className={styles.card}>
      <img className={styles.cardChild} src={`/images/${group?.AnhDaiDien}`} alt={group?.TenNhom || 'Group'} />
      <div className={styles.content}>
        <div className={styles.info6}>
          <div className={styles.tnNhm}>{group?.TenNhom || 'Tên nhóm không có'}</div>
          <div className={styles.mTGii}>{group?.GioiThieu || 'Không có mô tả'}</div>
        </div>
        <div className={styles.buttonCon}>
          <button className={styles.button3} onClick={() => onViewClick(group)}>
            <div className={styles.title1}>Xem nhóm</div>
          </button>
          <button className={styles.button4} onClick={() => handleJoin(group)}>
            <div className={styles.title1}>Tham gia</div>
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className={styles.groupyourgroupadmin}>
      <TopNavCom />
      <div className={styles.body}>
        <div className={`${styles.panel} ${isLeftExpanded ? styles.expanded : styles.collapsed}`}>
          <button className={styles.toggleButton} onClick={toggleLeftWidth}>
          {isLeftExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <div className={styles.button}>
            <div className={styles.nhm}>{`Nhóm `}</div>
            <button className={styles.hide} onClick={() => handleGroupNavigation(`/groupsuggest/${userId}`)}>
              Khám phá
            </button>
          </div>
          <button className={styles.toNhm} onClick={() => handleGroupNavigation(`/groupcreate/${userId}`)}>
            <div className={styles.button1}>
              <div className={styles.title}>Tạo nhóm mới</div>
            </div>
          </button>
          <form className={styles.tmKim}>
            <div className={styles.tmNhm}>Tìm nhóm</div>
            <input className={styles.tmKimChild} type="text" />
          </form>

          <div className={styles.nhm1}>
            <div className={styles.heading}>
              <div className={styles.nhmDoBn}>Nhóm do bạn quản lí</div>
              <button className={styles.moreButton} onClick={() => handleGroupNavigation(`/groupyourgroupadmin/${userId}`)}>
                <img className={styles.image23Icon} alt="" src="/RightUpArrow.png" />
              </button>
            </div>
            <div className={styles.list}>
              {managedGroups.length > 0 ? managedGroups.slice(0, 3).map(group => (
                <button key={group.id} className={styles.item} onClick={() => handleGroupNavigation(`/groupthaoluan/${userId}/${group.TenNhom}`)}>
                  <div className={styles.imageCon}>
                    <img className={styles.image20} src={`/images/${group?.AnhDaiDien}`}alt={group?.TenNhom || 'Group'} />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.tnNhm}>{group?.TenNhom || 'Tên nhóm không có'}</div>
                    {/* <div className={styles.giiThiu}>{group?.GioiThieu || 'Không có mô tả'}</div> */}
                  </div>
                </button>
              )) : <div className={styles.noGroups}>Chưa có nhóm nào được quản lý.</div>}
            </div>
          </div>
  
          <div className={styles.nhm1}>
            <div className={styles.heading}>
              <div className={styles.nhmDoBn}>Nhóm bạn tham gia</div>
              <button className={styles.moreButton} onClick={() => handleGroupNavigation(`/groupyourgroup/${userId}`)}>
                <img className={styles.image23Icon} alt="" src="/RightUpArrow.png" />
              </button>
            </div>
            <div className={styles.list}>
              {participatedGroups.length > 0 ? participatedGroups.slice(0, 3).map(group => (
                <button key={group.id} className={styles.item} onClick={() => handleGroupNavigation(`/groupthaoluan/${userId}/${group.TenNhom}`)}>
                  <div className={styles.imageCon}>
                    <img className={styles.image20} src={`/images/${group?.AnhDaiDien}`}alt={group?.TenNhom || 'Group'} />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.tnNhm}>{group?.TenNhom || 'Tên nhóm không có'}</div>
                    {/* <div className={styles.giiThiu}>{group?.GioiThieu || 'Không có mô tả'}</div> */}
                  </div>
                </button>
              )) : <div className={styles.noGroups}>Chưa có nhóm nào bạn tham gia.</div>}
            </div>
          </div>
        </div>

        <section className={styles.container}>
          <div className={styles.heading2}>
            <div className={styles.nhm}>Gợi ý</div>
          </div>
          <div className={styles.list2}>
            {groupData && groupData.length > 0 ? groupData.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onViewClick={group => handleGroupNavigation(`/groupthaoluan/${userId}/${group.TenNhom}`)}
              />
            )) : <div className={styles.noGroups}>Chưa có nhóm gợi ý nào.</div>}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default GroupSuggest;
