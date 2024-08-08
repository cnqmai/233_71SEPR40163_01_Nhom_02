import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format } from "date-fns"; 
import EditProfile from "../components/EditProfile";
import PortalPopup from "../components/PortalPopup";
import { useNavigate, useParams } from "react-router-dom";
import TopNavAcc from "../components/TopNavAccFocus";
import Footer from "../components/Footer";
import styles from "./AccountFollower.module.css";

const AccountFollower = () => {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams(); 

  const openEditProfilePopup = useCallback(() => {
    setEditProfilePopupOpen(true);
  }, []);

  const closeEditProfilePopup = useCallback(() => {
    setEditProfilePopupOpen(false);
  }, []);

  const fetchUserData = useCallback(async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3000/api/users/getuserbyid/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      
      const followResponse = await axios.get(`http://localhost:3000/api/users/getfollowinfo/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFollowedUsers(followResponse.data.NguoiTheoDoi);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
  }, [fetchUserData, id]);

  console.log(followedUsers);

  const onFrameButtonClick = useCallback(() => {
    // Please sync "Searching" to the project
  }, []);

  const onFrameButtonClick1 = useCallback(() => {
    navigate("/group");
  }, [navigate]);

  const onDescriptionClick = useCallback(() => {
    navigate(`/accountfollowing/${id}`);
  }, [navigate]);

  const onDescriptionClick1 = useCallback(() => {
    navigate(`/accountfollower/${id}`);
  }, [navigate]);

  const onThVinClick = useCallback(() => {
    navigate(`/accountthuvien/${id}`);
  }, [navigate]);

  const onHotNgClick = useCallback(() => {
    navigate(`/accounthoatdong/${id}`);
  }, [navigate]);

  return (
    <>
      <div className={styles.accountfollower}>
        <TopNavAcc />
        <div className={styles.body}>
          <div className={styles.profile}>
            <div className={styles.left}>
              <div className={styles.avatar}>
                <img
                  className={styles.image15Icon}
                  alt="Avatar"
                  src={userData?.AnhDaiDien ? `/images/${userData.AnhDaiDien}` : '/UnknownUser.jpg'}
                />
              </div>
              <div className={styles.container}>
              <div className={styles.title}>{userData ? userData.HoTen : "Loading..."}</div>
                <div className={styles.description}>
                  Tham gia từ {userData ? format(new Date(userData.NgayTao), "dd/MM/yyyy") : "Loading..."}
                </div>
                <div className={styles.descriptionParent}>
                  <button
                    className={styles.description2}
                    onClick={onDescriptionClick}
                  >{userData ? `${userData.DangTheoDoi.length} đang theo dõi` : "Loading..."}</button>
                  <button
                    className={styles.description3}
                    onClick={onDescriptionClick1}
                  >{userData ? `${userData.NguoiTheoDoi.length} người theo dõi` : "Loading..."}</button>
                </div>
                <div className={styles.description}>{userData ? userData.GioiThieu : "Loading..."}</div>
              </div>
            </div>
            <button className={styles.button} onClick={openEditProfilePopup}>
              <div className={styles.primary} />
              <button className={styles.title1} onClick={openEditProfilePopup}>
                Chỉnh sửa
              </button>
            </button>
            <img
              className={styles.profileChild}
              alt=""
              src="/vector-2004.svg"
            />
          </div>
        
          <div className={styles.container1}>
          <div className={styles.section}>
            <button className={styles.thVin} onClick={onThVinClick}>
              <div className={styles.biNhGi}>Thư viện</div>
            </button>
            <div className={styles.split} />
            <button className={styles.hotNg} onClick={onHotNgClick}>
              <div className={styles.biNhGi}>Bài đánh giá</div>
            </button>
          </div>
            <div className={styles.heading}>
              <div className={styles.ngiTheoDi}>Người theo dõi</div>
            </div>
            <div className={styles.list}>
              {followedUsers.length > 0 ? (
                followedUsers.map(user => (
                  <div key={user._id} className={styles.item}>
                    <button className={styles.avatar1} onClick={() => navigate(`/accountthuvien/${user.ID}`)}>
                      <img className={styles.image15} alt={user.HoTen} src={user.AnhDaiDien ? `/images/${user.AnhDaiDien}` : '/UnknownUser.jpg'} />
                    </button>
                    <div className={styles.container2}>
                      <button className={styles.title2} onClick={() => navigate(`/accountthuvien/${user.ID}`)}>
                        {user.HoTen}
                      </button>
                      <div className={styles.description4}>Tham gia từ {format(new Date(user.NgayTao), "MMMM yyyy")}</div>
                      <div className={styles.description4}>{user.GioiThieu}</div>
                      <div className={styles.follow}>
                        <button className={styles.description6}>
                          {user.DangTheoDoi.length} đang theo dõi
                        </button>
                        <button className={styles.description6}>
                          {user.NguoiTheoDoi.length} người theo dõi
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <img className={styles.profileChild} alt="" src="/vector-200.svg" />
          </div>
        </div>
        <div className={styles.buttonWrapper}>
          <div className={styles.button1}>
            <div className={styles.primary} />
            <div className={styles.ngiTheoDi}>Xem thêm</div>
          </div>
        </div>
        <Footer />
      </div>
      {isEditProfilePopupOpen && (
        <PortalPopup
          overlayColor="rgba(112, 120, 150, 0.3)"
          placement="Centered"
          onOutsideClick={closeEditProfilePopup}
        >
          <EditProfile onClose={closeEditProfilePopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default AccountFollower;
