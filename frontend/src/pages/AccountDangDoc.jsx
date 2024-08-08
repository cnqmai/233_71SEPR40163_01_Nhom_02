import { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from "axios";
import { format } from "date-fns"; 
import EditProfile from "../components/EditProfile";
import PortalPopup from "../components/PortalPopup";
import { useNavigate, useParams } from "react-router-dom";
import TopNavAcc from "../components/TopNavAccFocus";
import Footer from "../components/Footer";
import styles from "./AccountDangDoc.module.css";

const AccountDangDoc = () => {
  const [isLeftExpanded, setLeftExpanded] = useState(true);
  const toggleLeftWidth = () => {
    setLeftExpanded((prev) => !prev);
  };
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [booksReading, setBooksReading] = useState([]);
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
      // Fetch books data
      fetchBooksData(userId);
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
      setBooksReading(readingResponse.data);
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

  const onButtonClick = useCallback(() => {
    navigate(`/accountsachdadocnamnay/${id}`);
  }, [navigate]);

  const onCardClick = useCallback((title) => {
    const encodedTitle = encodeURIComponent(title);
    navigate(`/sach/${encodedTitle}`);
  }, [navigate]);

  return (
    <>
      <div className={styles.accountdangdoc}>
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
                    <div
                      className={styles.bnC}
                    >{`Bạn đã đọc x cuốn sách trong năm xxxx. `}</div>
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
              <div className={styles.container2}>
                <div className={styles.headingParent}>
                  <div className={styles.heading1}>
                    <div className={styles.angC}>Đang đọc</div>
                  </div>
                  <div className={styles.list}>
                  {booksReading.length > 0 ? (
                      booksReading.map((book) => (
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
                      ))
                    ) : (
                      <p>Chưa có sách Đang Đọc.</p>
                    )}
                  </div>
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
          placement="Centered"
          onOutsideClick={closeEditProfilePopup}
        >
          <EditProfile onClose={closeEditProfilePopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default AccountDangDoc;
