import { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from "axios";
import { format } from "date-fns"; 
import EditProfile from "../components/EditProfile";
import PortalPopup from "../components/PortalPopup";
import { useNavigate, useParams } from "react-router-dom";
import TopNavAcc from "../components/TopNavAccFocus";
import Footer from "../components/Footer";
import styles from "./AccountThuVien.module.css";

const AccountThuVien = () => {
  const [isLeftExpanded, setLeftExpanded] = useState(true);
  const toggleLeftWidth = () => {
    setLeftExpanded((prev) => !prev);
  };
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [booksReading, setBooksReading] = useState([]);
  const [booksWantToRead, setBooksWantToRead] = useState([]);
  const [booksRead, setBooksRead] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [isFollowing, setIsFollowing] = useState(false); // New state for follow status
  const currentYear = new Date().getFullYear();

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
    
      const response = await axios.get(`http://localhost:3000/api/users/getuserbyid/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      fetchBooksData(userId);

      // Check if current user follows this user
      const isCurrentlyFollowing = response.data.NguoiTheoDoi.some(id => id.toString() === currentUserObjectId.toString());
      setIsFollowing(isCurrentlyFollowing);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  const fetchBooksData = useCallback(async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const readingResponse = await axios.get(`http://localhost:3000/api/books/readingbooks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const wantToReadResponse = await axios.get(`http://localhost:3000/api/books/wantoreadbooks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const readResponse = await axios.get(`http://localhost:3000/api/books/readbooks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooksReading(readingResponse.data);
      setBooksWantToRead(wantToReadResponse.data);
      setBooksRead(readResponse.data);
    } catch (error) {
      console.error("Error fetching books data:", error);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
  }, [fetchUserData, id]);

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

  const onMoreButtonClick = useCallback(() => {
    navigate(`/accountdangdoc/${id}`);
  }, [navigate, id]);

  const onMoreButtonClick1 = useCallback(() => {
    navigate(`/accountmuondoc/${id}`);
  }, [navigate, id]);

  const onMoreButtonClick2 = useCallback(() => {
    navigate(`/accountdadoc/${id}`);
  }, [navigate, id]);

  const onCardClick = useCallback((title) => {
    const encodedTitle = encodeURIComponent(title);
    navigate(`/sach/${encodedTitle}`);
  }, [navigate]);

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
      <div className={styles.accountthuvien}>
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
            <div className={styles.section}>
              <button className={styles.thVin} onClick={onThVinClick}>
                <b className={styles.thVin1}>Thư viện</b>
              </button>
              <div className={styles.split} />
              <button className={styles.hotNg} onClick={onHotNgClick}>
                <div className={styles.biNhGi}>Bài đánh giá</div>
              </button>
            </div>
              <div className={styles.angC}>
                <div className={styles.heading1}>
                  <div className={styles.angC1}>Sách đang đọc</div>
                  <button
                    className={styles.moreButton}
                    onClick={onMoreButtonClick}
                  >
                    <img
                      className={styles.image23Icon}
                      alt=""
                      src="/RightUpArrow.png"
                    />
                  </button>
                </div>
                <div className={styles.slide}>
                  <button className={styles.button2}>
                    <img
                      className={styles.buttonChild}
                      alt=""
                      src="/LeftArrow.png"
                    />
                  </button>
                  <div className={styles.bookContainer}>
                  {booksReading.map(book => (
                    <button className={styles.card} key={book._id} onClick={() => onCardClick(book.TieuDe)}>
                      <img
                        className={styles.cover}
                        src={`/images/${book.AnhBia}`}
                        alt={`Cover of ${book.TieuDe}`}
                      />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>{book.TieuDe}</div>
                        <div className={styles.tcGi}>{book.TacGia.HoTen}</div>
                      </div>
                    </button>
                  ))}
                  </div>
                  <button className={styles.button2}>
                    <img
                      className={styles.buttonChild}
                      alt=""
                      src="/RightArrow.png"
                    />
                  </button>
                </div>
              </div>
              <div className={styles.angC}>
                <div className={styles.heading1}>
                  <div className={styles.angC1}>Sách muốn đọc</div>
                  <button
                    className={styles.moreButton}
                    onClick={onMoreButtonClick1}
                  >
                    <img
                      className={styles.image23Icon}
                      alt=""
                      src="/RightUpArrow.png"
                    />
                  </button>
                </div>
                <div className={styles.slide}>
                  <button className={styles.button2}>
                    <img
                      className={styles.buttonChild}
                      alt=""
                      src="/LeftArrow.png"
                    />
                  </button>
                  <div className={styles.bookContainer}>
                  {booksWantToRead.map(book => (
                    <button className={styles.card} key={book._id} onClick={() => onCardClick(book.TieuDe)}>
                      <img
                        className={styles.cover}
                        src={`/images/${book.AnhBia}`}
                        alt={`Cover of ${book.TieuDe}`}
                      />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>{book.TieuDe}</div>
                        <div className={styles.tcGi}>{book.TacGia.HoTen}</div>
                      </div>
                    </button>
                  ))}
                  </div>
                  <button className={styles.button2}>
                    <img
                      className={styles.buttonChild}
                      alt=""
                      src="/RightArrow.png"
                    />
                  </button>
                </div>
              </div>
              <div className={styles.angC}>
                <div className={styles.heading1}>
                  <div className={styles.angC1}>Sách đã đọc</div>
                  <button
                    className={styles.moreButton}
                    onClick={onMoreButtonClick2}
                  >
                    <img
                      className={styles.image23Icon}
                      alt=""
                      src="/RightUpArrow.png"
                    />
                  </button>
                </div>
                <div className={styles.slide}>
                  <button className={styles.button2}>
                    <img
                      className={styles.buttonChild}
                      alt=""
                      src="/LeftArrow.png"
                    />
                  </button>
                  <div className={styles.bookContainer}>
                  {booksRead.map(book => (
                    <button className={styles.card} key={book._id} onClick={() => onCardClick(book.TieuDe)}>
                      <img
                        className={styles.cover}
                        src={`/images/${book.AnhBia}`}
                        alt={`Cover of ${book.TieuDe}`}
                      />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>{book.TieuDe}</div>
                        <div className={styles.tcGi}>{book.TacGia.HoTen}</div>
                      </div>
                    </button>
                  ))}
                  </div>
                  <button className={styles.button2}>
                    <img
                      className={styles.buttonChild}
                      alt=""
                      src="/RightArrow.png"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        {isEditProfilePopupOpen && (
          <PortalPopup onClose={closeEditProfilePopup}>
            <EditProfile onClose={closeEditProfilePopup} />
          </PortalPopup>
        )}
      </div>
    </>
  );
};

export default AccountThuVien;
