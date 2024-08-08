import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import EditProfile from "../components/EditProfile";
import PortalPopup from "../components/PortalPopup";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import TopNavAcc from "../components/TopNavAccFocus";
import Footer from "../components/Footer";
import styles from "./AccountHoatDong.module.css";

// Hàm để kiểm tra và chuyển đổi ngày tháng
const safeDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
};

const AccountHoatDong = () => {
  const [isLeftExpanded, setLeftExpanded] = useState(true);
  const toggleLeftWidth = () => {
    setLeftExpanded((prev) => !prev);
  };
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [booksRead, setBooksRead] = useState([]);
  const currentYear = new Date().getFullYear();
  const [isFollowing, setIsFollowing] = useState(false); // New state for follow status

  const openEditProfilePopup = useCallback(() => {
    setEditProfilePopupOpen(true);
  }, []);

  const closeEditProfilePopup = useCallback(() => {
    setEditProfilePopupOpen(false);
  }, []);

  const fetchUserData = useCallback(async (userId) => {
    const token = localStorage.getItem('token');
    const customId = localStorage.getItem('userId'); // Custom ID
    try {
      // Fetch the actual ObjectId using the custom ID
      const { data: user } = await axios.get(`http://localhost:3000/api/users/getuserbyid/${customId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const currentUserObjectId = user._id; // The ObjectId of the current user

      // Fetch user data by their userId
      const response = await axios.get(`http://localhost:3000/api/users/getuserbyid/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      
      // Check if current user follows this user
      const isCurrentlyFollowing = response.data.NguoiTheoDoi.some(id => id.toString() === currentUserObjectId.toString());
      setIsFollowing(isCurrentlyFollowing);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  const fetchUserReviews = useCallback(async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3000/api/reviews/getreviewsbyuser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserReviews(response.data);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    }
  }, []);

  const fetchBooksData = useCallback(async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const readResponse = await axios.get(`http://localhost:3000/api/books/readbooks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooksRead(readResponse.data);
    } catch (error) {
      console.error("Error fetching books data:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData(id);
    fetchUserReviews(id);
    fetchBooksData(id); 
  }, [fetchUserData, fetchUserReviews, fetchBooksData, id]);
  
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
  
    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <img key={index} className={styles.frameChild} alt="Star" src="/star-2.svg" />
        ))}
      </>
    );
  };
  
  const onFrameButtonClick = useCallback(() => {
    // Please sync "Searching" to the project
  }, []);

  const onFrameButtonClick1 = useCallback(() => {
    navigate(`/group/${id}`);
  }, [navigate, id]);

  const onDescriptionClick = useCallback(() => {
    navigate(`/accountfollowing/${id}`);
  }, [navigate, id]);

  const onDescriptionClick1 = useCallback(() => {
    navigate(`/accountfollower/${id}`);
  }, [navigate, id]);

  const onThVinClick = useCallback(() => {
    navigate(`/accountthuvien/${id}`);
  }, [navigate, id]);

  const onHotNgClick = useCallback(() => {
    navigate(`/accounthoatdong/${id}`);
  }, [navigate, id]);

  const onButtonClick = useCallback(() => {
    navigate(`/accountsachdadocnamnay/${id}`);
  }, [navigate, id]);

  const handleFollowToggle = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      if (isFollowing) {
        // Unfollow the user
        await axios.post(`http://localhost:3000/api/users/unfollow/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Follow the user
        await axios.post(`http://localhost:3000/api/users/follow/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      
      // Toggle the follow status
      setIsFollowing(!isFollowing);

      window.location.reload();
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  }, [id, isFollowing]);
  
  return (
    <>
      <div className={styles.accounthoatdong}>
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
                  Tham gia từ {userData ? format(safeDate(userData.NgayTao) || new Date(), "dd/MM/yyyy") : "Loading..."}
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
            {userData && id !== localStorage.getItem('userId') ? (
              <button className={styles.button} onClick={handleFollowToggle}>
                <div className={styles.primary} />
                <button className={styles.title1}>
                  {isFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
                </button>
              </button>
            ) : (
              <button className={styles.button} onClick={openEditProfilePopup}>
                <div className={styles.primary} />
                <button className={styles.title1}>
                  Chỉnh sửa
                </button>
              </button>
            )}
            <img className={styles.profileChild} alt="" src="/vector-200.svg" />
          </div>
          <div className={styles.container1}>
          <div className={`${styles.toggledrawer} ${isLeftExpanded ? styles.expanded : styles.collapsed}`}>
              <button className={styles.toggleButton} onClick={toggleLeftWidth}>
              {isLeftExpanded ? <FaChevronLeft /> : <FaChevronRight />}
              </button>
              <div className={styles.giiThiuSThch}>
                <div className={styles.sThch}>
                  <div className={styles.sThch1}>Sở thích</div>
                  <div className={styles.cSchV}>
                    {userData ? userData.SoThich.join(', ') : "Loading..."}
                  </div>
                </div>
                <div className={styles.giiThiu}>
                  <div className={styles.sThch1}>Giới Thiệu</div>
                  <div className={styles.tiRtYu}>
                    {userData ? userData.GioiThieu : "Loading..."}
                  </div>
                </div>
              </div>
              <div className={styles.challenge2023}>
                <div className={styles.heading}>
                  <div className={styles.cunSchTrong}>
                    Cuốn sách trong năm của tôi
                  </div>
                </div>
                <div className={styles.content}>
                  <img
                    className={styles.image20Icon}
                    alt=""
                    src="/YearInBook2023.png"
                  />
                  <div className={styles.text}>
                    <div className={styles.bnC}>
                      Bạn đã đọc {`${booksRead.length}`} cuốn sách trong năm {currentYear}.
                    </div>
                    <div className={styles.bnC}>
                      Hãy xem Năm của bạn trong sách. Tốt, xấu, dài, ngắn—tất cả
                      đều ở đây.
                    </div>
                  </div>
                </div>
                <button className={styles.button1} onClick={onButtonClick}>
                  <div className={styles.xemThm}>Xem thêm</div>
                </button>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.container2}>
                <div className={styles.heading1}>
                  <div className={styles.section}>
                    <button className={styles.thVin} onClick={onThVinClick}>
                      <div className={styles.thVin1}>Thư viện</div>
                    </button>
                    <div className={styles.split} />
                    <button className={styles.hotNg} onClick={onHotNgClick}>
                      <b className={styles.biNhGi}>Bài đánh giá</b>
                    </button>
                  </div>
                  <div className={styles.hotNg1}>Hoạt động</div>
                </div>
                <div className={styles.list}>
                  {userReviews.length > 0 ? (
                    userReviews.map((review) => (
                      <div key={review._id} className={styles.item}>
                        <div className={styles.book}>
                          <div className={styles.avatar1}>
                          <img
                            className={styles.avatarChild}
                            src={review.Sach.AnhBia ? `/images/${review.Sach.AnhBia}` : '/DefaultBookCover.jpg'}
                            alt="Book Cover"
                          />
                          </div>
                          <div className={styles.nhGiKimParent}>
                            <div className={styles.nhGiKim}><Link to={`/sach/${review.Sach.TieuDe}`} style={{ textDecoration: 'none', color: '#000000' }}>{review.Sach.TieuDe}</Link></div>
                            <div className={styles.tcGi}>
                              {review.Sach.TacGia.map((tacGia, index) => (
                                <span key={tacGia._id}>
                                  {tacGia.HoTen}
                                  {index < review.Sach.TacGia.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className={styles.review}>
                          <div className={styles.bnC}>{review.NoiDung}</div>
                          <div className={styles.frameParent}>
                            <div className={styles.stars}>
                              {renderStars(review.SoDiem)}
                            </div>
                            <div className={styles.ngyNg}>
                              {review.NgayViet ? format(safeDate(review.NgayViet) || new Date(), "dd/MM/yyyy") : "Invalid date"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>Loading reviews...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {isEditProfilePopupOpen && (
        <PortalPopup
          overlayColor="rgba(112, 120, 150, 0.3)"
          onClose={closeEditProfilePopup}
        >
          <EditProfile onClose={closeEditProfilePopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default AccountHoatDong;
