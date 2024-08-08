import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import TopNavCom from "../components/TopNavComFocus";
import Footer from "../components/Footer";
import styles from "./GroupYourGroupAdmin.module.css";

const GroupYourGroupAdmin = () => {
  const [isLeftExpanded, setLeftExpanded] = useState(true);
  const toggleLeftWidth = () => {
    setLeftExpanded((prev) => !prev);
  };
  const navigate = useNavigate();
  const { groupName, userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [managedGroups, setManagedGroups] = useState([]);
  const [participatedGroups, setParticipatedGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu cho nhóm cụ thể
  const fetchGroupData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get(`http://localhost:3000/api/groups/getgroupwithposts/${userId}/${groupName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroupData(response.data);
      setPosts(response.data.BaiDang); 
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setManagedGroups(response.data);
    } catch (error) {
      console.error("Failed to fetch managed groups", error);
    }
  };

  // Fetch nhóm mà người dùng tham gia
  const fetchParticipatedGroups = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get(`http://localhost:3000/api/groups/getjoinedgroups/${userId}/${groupName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParticipatedGroups(response.data);
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

  const handleLeaveGroup = async (group) => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.post(`http://localhost:3000/api/groups/leave`, 
        { groupId: group._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchManagedGroups();
      fetchParticipatedGroups();
      if (error.response && error.response.status === 400) {
        alert('Bạn không thể rời nhóm vì bạn là quản trị viên duy nhất.');
      } else {
        console.error("Failed to leave group", error);
        alert('Rời nhóm thất bại');
      }
    } catch (error) {
      console.error("Failed to leave group", error);
      alert('Rời nhóm thất bại')
    }
  };

  const GroupCard = ({ group, onViewClick, onLeaveClick }) => (
    <form className={styles.card}>
      <img className={styles.cardChild} src={`/images/${group?.AnhDaiDien}`} alt={group?.TenNhom} />
      <div className={styles.content}>
        <div className={styles.info6}>
          <div className={styles.tnNhm6}>{group.TenNhom}</div>
          <div className={styles.mTGii}>{group.GioiThieu}</div>
        </div>
        <div className={styles.buttonCon}>
          <button className={styles.button3} onClick={() => onViewClick(group)}>
            <div className={styles.title1}>Xem nhóm</div>
          </button>
          <button className={styles.button4} onClick={() => onLeaveClick(group)}>
            <div className={styles.title1}>Rời nhóm</div>
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
              <div className={styles.primary} />
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
              {managedGroups.slice(0, 3).map(group => (
                <button key={group._id} className={styles.item} onClick={() => handleGroupNavigation(`/groupthaoluan/${userId}/${group.TenNhom}`)}>
                  <div className={styles.imageCon}>
                    <img className={styles.image20} src={`/images/${group?.AnhDaiDien}`}alt={group?.TenNhom} />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.tnNhm}>{group.TenNhom}</div>
                    {/* <div className={styles.giiThiu}>{group.GioiThieu}</div> */}
                  </div>
                </button>
              ))}
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
              {participatedGroups.slice(0, 3).map(group => (
                <button key={group._id} className={styles.item} onClick={() => handleGroupNavigation(`/groupthaoluan/${userId}/${group.TenNhom}`)}>
                  <div className={styles.imageCon}>
                    <img className={styles.image20} src={`/images/${group?.AnhDaiDien}`}alt={group?.TenNhom} />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.tnNhm}>{group.TenNhom}</div>
                    {/* <div className={styles.giiThiu}>{group.GioiThieu}</div> */}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className={styles.container}>
          <div className={styles.heading2}>
            <div className={styles.nhm}>Nhóm do bạn quản lí</div>
          </div>
          <div className={styles.list2}>
            {managedGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onViewClick={group => handleGroupNavigation(`/groupthaoluan/${userId}/${group.TenNhom}`)}
                onLeaveClick={handleLeaveGroup} 
              />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default GroupYourGroupAdmin;
