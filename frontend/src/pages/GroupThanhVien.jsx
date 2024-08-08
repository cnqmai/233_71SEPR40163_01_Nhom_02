import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { format } from "date-fns"; 
import TopNavCom from "../components/TopNavComFocus";
import Footer from "../components/Footer";
import styles from "./GroupThanhVien.module.css";

const GroupThanhVien = () => {
  const [isLeftExpanded, setLeftExpanded] = useState(true);
  const toggleLeftWidth = () => {
    setLeftExpanded((prev) => !prev);
  };
  const { groupName, userId  } = useParams(); 
  const [groupData, setGroupData] = useState(null);
  const [managedGroups, setManagedGroups] = useState([null]);
  const [participatedGroups, setParticipatedGroups] = useState([null]);
  const [userData, setUserData] = useState(null);
  const [usersData, setUsers] = useState([]);
  const [adminData, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

// Fetch dữ liệu cho nhóm cụ thể
const fetchGroupData = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(`http://localhost:3000/api/groups/getgroupwithusers/${userId}/${groupName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setGroupData(response.data.group);
    setUsers(response.data.users);
    setAdmins(response.data.admins); 
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
  } finally {
    setLoading(false);
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
  } finally {
    setLoading(false);
  }
};

  // Fetch dữ liệu người dùng đang đăng nhập
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token is missing');
        return;
    }

    try {
        const response = await axios.get('http://localhost:3000/api/users/getuser', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setUserData(response.data);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchGroupData();
    fetchManagedGroups();
    fetchParticipatedGroups();
    fetchUserData();
  }, [groupName, userId]);

  const navigate = useNavigate();

  const handleNavigate = useCallback((path, id = '', extra = '') => {
    navigate(`${path}/${id}${extra ? `/${extra}` : ''}`);
  }, [navigate]);
  
  const handleJoinGroup = async () => {
    const token = localStorage.getItem('token');
    if (!token || !groupData?._id) return;
  
    try {
      await axios.post('http://localhost:3000/api/groups/join', 
        { groupId: groupData._id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Cập nhật trạng thái tham gia nhóm
      setIsJoined(true);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const isUserInGroup = (groupId) => {
    return userData?.NhomThamGia.includes(groupId);
  };

  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (userData && groupData) {
      setIsJoined(isUserInGroup(groupData._id));
    }
  }, [userData, groupData]);

  return (
    <div className={styles.groupthanhvien}>
      <TopNavCom />
      <div className={styles.body}>
        <div className={`${styles.panel} ${isLeftExpanded ? styles.expanded : styles.collapsed}`}>
            <button className={styles.toggleButton} onClick={toggleLeftWidth}>
            {isLeftExpanded ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          <div className={styles.button}>
            <div className={styles.nhm}>{`Nhóm `}</div>
            <button className={styles.hide} onClick={() => handleNavigate('/groupsuggest', userData?.ID)}>
              {`Khám phá`}
              </button>
          </div>
          <button className={styles.toNhm} onClick={() => handleNavigate('/groupcreate', userData?.ID)}>
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
              <button className={styles.moreButton} onClick={() => handleNavigate('/groupyourgroupadmin', userData?.ID)}>
                <img className={styles.image23Icon} alt="" src="/RightUpArrow.png" />
              </button>
            </div>
            <div className={styles.list}>
              {managedGroups.slice(0, 3).map((managedGroup, index) => (
                <button key={index} className={styles.item} onClick={() => handleNavigate('/groupthaoluan', userData?.ID, managedGroup?.TenNhom)}>
                  <div className={styles.imageCon}>
                    <img className={styles.image20} src={`/images/${managedGroup?.AnhDaiDien}`}alt={managedGroup?.TenNhom} />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.tnNhm}>{managedGroup?.TenNhom}</div>
                    {/* <div className={styles.giiThiu}>{managedGroup?.GioiThieu}</div> */}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.nhm1}>
            <div className={styles.heading}>
              <div className={styles.nhmDoBn}>Nhóm bạn tham gia</div>
              <button className={styles.moreButton} onClick={() => handleNavigate('/groupyourgroup', userData?.ID)}>
                <img className={styles.image23Icon} alt="" src="/RightUpArrow.png" />
              </button>
            </div>
            <div className={styles.list}>
              {participatedGroups.slice(0, 3).map((participatedGroup, index) => (
                <button key={index} className={styles.item} onClick={() => handleNavigate('/groupthaoluan', userData?.ID, participatedGroup?.TenNhom)}>
                  <div className={styles.imageCon}>
                    <img className={styles.image20} src={`/images/${participatedGroup?.AnhDaiDien}`}alt={participatedGroup?.TenNhom} />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.tnNhm}>{participatedGroup?.TenNhom}</div>
                    {/* <div className={styles.giiThiu}>{participatedGroup?.GioiThieu}</div> */}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.cover} />
          <div className={styles.profile}>
            <div className={styles.status}>
              <img
                className={styles.statusChild}
                alt=""
                src={`/images/${groupData?.AnhDaiDien || 'default-image.png'}`}
              />
              <div className={styles.section}>
                <button className={styles.button2} onClick={() => handleNavigate('/groupyourgroupadmin', userData?.ID)}>
                  <div className={styles.title1}>Thảo luận</div>
                </button>
                <div className={styles.button3}>
                  <div className={styles.title1}>Mọi người</div>
                </div>
              </div>
            </div>
            <div className={styles.infoParent}>
              <div className={styles.info6}>
                <div className={styles.tnNhmParent}>
                  <div className={styles.nhm}>{groupData?.TenNhom}</div>
                  <div className={styles.div}>{groupData?.NgayTao ? format(new Date(groupData.NgayTao), 'dd/MM/yyyy') : 'N/A'}</div>
                </div>
                <div className={styles.chngTiKhng}>
                  {groupData?.GioiThieu}
                </div>
              </div>
              <div className={styles.status1}>
                <button className={styles.button4} onClick={handleJoinGroup} disabled={isJoined}>
                  <span className={styles.title1}>
                    {isJoined ? "Đã tham gia" : "Tham gia"}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className={styles.accountCon}>
            {/* <form className={styles.tmKim1}>
              <div className={styles.heading2}>
                <div className={styles.tmKim2}>{`Tìm kiếm `}</div>
              </div>
              <input className={styles.tmKimItem} type="text" />
            </form> */}

   
            <div className={styles.ngiDng}>
                <div className={styles.heading3}>
                  <div className={styles.nhmDoBn}>Bạn</div>
                </div>
              <div className={styles.item6}>
                <button className={styles.avatar} onClick={() => handleNavigate('/accountthuvien', userData?.ID)}>
                    <img
                      className={styles.image15}
                      src={userData?.AnhDaiDien ? `/images/${userData?.AnhDaiDien}` : '/default.png'}
                      alt={userData?.HoTen}
                    />
                </button>
                <div className={styles.container2}>
                  <button
                    className={styles.title4}
                    onClick={() => handleNavigate('/accountthuvien', userData?.ID)}
                  >
                    {userData?.HoTen}
                  </button>
                  <div className={styles.description}>Tham gia từ {userData?.NgayTao ? format(new Date(userData?.NgayTao), 'dd/MM/yyyy') : 'Unknown'}</div>
                  <div className={styles.description}>{userData?.GioiThieu}</div>
                  <div className={styles.follow}>
                    <button
                      className={styles.description2}
                      onClick={() => handleNavigate('/accountfollowing', user.ID)}
                    >
                      {userData?.DangTheoDoi.length || 0} đang theo dõi
                    </button>
                    <button
                      className={styles.description2}
                      onClick={() => handleNavigate('/accountfollower', user.ID)}
                    >
                      {userData?.NguoiTheoDoi.length || 0} người theo dõi
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.qunTrVin}>
              <div className={styles.heading3}>
                <div className={styles.nhmDoBn}>Quản trị viên</div>
              </div>
              <div className={styles.list2}>
              {adminData.map((admin) => (
                <div key={admin._id} className={styles.item7}>
                  <button
                    className={styles.avatar}
                    onClick={() => handleNavigate('/accountthuvien', admin.ID)}
                  >
                    <img
                      className={styles.image15}
                      src={admin.AnhDaiDien ? `/images/${admin.AnhDaiDien}` : '/default.png'}
                      alt={admin.HoTen}
                    />
                  </button>
                  <div className={styles.container2}>
                    <button
                      className={styles.title4}
                      onClick={() => handleNavigate('/accountthuvien', admin.ID)}
                    >
                      {admin.HoTen}
                    </button>
                    <div className={styles.description}> Tham gia từ {admin.NgayTao ? format(new Date(admin.NgayTao), 'dd/MM/yyyy') : 'Unknown'}</div>
                    <div className={styles.description}>{admin.GioiThieu}</div>
                    <div className={styles.follow}>
                      <button
                        className={styles.description2}
                        onClick={() => handleNavigate('/accountfollowing', admin.ID)}
                      >
                        {admin.DangTheoDoi.length || 0} following
                      </button>
                      <button
                        className={styles.description2}
                        onClick={() => handleNavigate('/accountfollower', admin.ID)}
                      >
                        {admin.NguoiTheoDoi.length || 0} followers
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.button5}>
              {/* <button className={styles.button6}>
                <div className={styles.title7}>Xem thêm</div>
              </button> */}
            </div>
          </div>

          <div className={styles.thnhVin}>
            <div className={styles.heading3}>
              <div className={styles.nhmDoBn}>Thành viên</div>
            </div>
            <div className={styles.list3}>
              {usersData.map((user) => (
                <div key={user._id} className={styles.item7}>
                  <button
                    className={styles.avatar}
                    onClick={() => handleNavigate('/accountthuvien', user.ID)}
                  >
                    <img
                      className={styles.image15}
                      src={user.AnhDaiDien ? `/images/${user.AnhDaiDien}` : '/default.png'}
                      alt={user.HoTen}
                    />
                  </button>
                  <div className={styles.container2}>
                    <button
                      className={styles.title4}
                      onClick={() => handleNavigate('/accountthuvien', user.ID)}
                    >
                      {user.HoTen}
                    </button>
                    <div className={styles.description}>Tham gia từ {user.NgayTao ? format(new Date(user.NgayTao), 'dd/MM/yyyy') : 'Unknown'}</div>
                    <div className={styles.description}>{user.GioiThieu}</div>
                    <div className={styles.follow}>
                      <button
                        className={styles.description2}
                        onClick={() => handleNavigate('/accountfollowing', user.ID)}
                      >
                        {user.DangTheoDoi.length|| 0} đang theo dõi
                      </button>
                      <button
                        className={styles.description2}
                        onClick={() => handleNavigate('/accountfollower', user.ID)}
                      >
                        {user.DangTheoDoi.length || 0} người theo dõi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

              <div className={styles.button5}>
                {/* <button className={styles.button6}>
                  <div className={styles.title7}>Xem thêm</div>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GroupThanhVien;
