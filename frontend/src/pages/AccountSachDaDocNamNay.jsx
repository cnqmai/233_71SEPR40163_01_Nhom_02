import { useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import EditProfile from "../components/EditProfile";
import PortalPopup from "../components/PortalPopup";
import { useNavigate } from "react-router-dom";
import TopNavAcc from "../components/TopNavAccFocus";
import Footer from "../components/Footer";
import styles from "./AccountSachDaDocNamNay.module.css";

const AccountSachDaDocNamNay = () => {
  const [isLeftExpanded, setLeftExpanded] = useState(true);
  const toggleLeftWidth = () => {
    setLeftExpanded((prev) => !prev);
  };
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const navigate = useNavigate();

  const openEditProfilePopup = useCallback(() => {
    setEditProfilePopupOpen(true);
  }, []);

  const closeEditProfilePopup = useCallback(() => {
    setEditProfilePopupOpen(false);
  }, []);

  const onDescriptionClick = useCallback(() => {
    navigate("/accountfollowing");
  }, [navigate]);

  const onDescriptionClick1 = useCallback(() => {
    navigate("/accountfollower");
  }, [navigate]);

  const onThVinClick = useCallback(() => {
    navigate("/accountthuvien/");
  }, [navigate]);

  const onHotNgClick = useCallback(() => {
    navigate("/accounthoatdong");
  }, [navigate]);

  const onButtonClick = useCallback(() => {
    navigate("/accountsachdadocnamnay");
  }, [navigate]);

  const onCardClick = useCallback(() => {
    // Please sync "Sach" to the project
  }, []);

  return (
    <>
      <div className={styles.accountsachdadocnamnay}>
        <TopNavAcc />
        <div className={styles.body}>
          <div className={styles.profile}>
            <div className={styles.left}>
              <div className={styles.avatar}>
                <img
                  className={styles.image15Icon}
                  alt=""
                  src="/image-15@2x.png"
                />
              </div>
              <div className={styles.container}>
                <div className={styles.title}>User's Name</div>
                <div className={styles.description}>Joined June 2024</div>
                <div className={styles.description}>Mô tả</div>
                <div className={styles.descriptionParent}>
                  <button
                    className={styles.description2}
                    onClick={onDescriptionClick}
                  >{`x following `}</button>
                  <button
                    className={styles.description3}
                    onClick={onDescriptionClick1}
                  >{`y followers `}</button>
                </div>
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
                    Đọc Sách, Vẽ Tranh, Coi Phim
                  </div>
                </div>
                <div className={styles.giiThiu}>
                  <div className={styles.sThch1}>Giới Thiệu</div>
                  <div className={styles.tiRtYu}>
                    Tôi rất yêu thích động vật và thường xuyên tham gia các hoạt
                    động bảo vệ động vật. Tôi cũng thích tập yoga để thư giãn và
                    giữ sức khỏe.
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
                    <div className={styles.schTrongNm}>Sách trong năm 2023</div>
                  </div>
                  <div className={styles.list}>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
                    <button className={styles.card} onClick={onCardClick}>
                      <div className={styles.cover} />
                      <div className={styles.heading}>
                        <div className={styles.tnSch}>Tên sách</div>
                        <div className={styles.tcGi}>Tác giả</div>
                      </div>
                    </button>
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

export default AccountSachDaDocNamNay;
