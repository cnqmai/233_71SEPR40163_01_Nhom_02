import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PropTypes from "prop-types";
import styles from "./PanelDefault.module.css";

const PanelDefault = memo(({ }) => {
  const navigate = useNavigate();
  const [isLeftExpanded, setLeftExpanded] = useState(true);
  const toggleLeftWidth = () => {
    setLeftExpanded((prev) => !prev);
  };
  const onAllBookClick = useCallback(() => {
    navigate("/adminbookall");
  }, [navigate]);

  const onAddBookClick = useCallback(() => {
    navigate("/adminbookadd");
  }, [navigate]);

  const onAllAuthorClick = useCallback(() => {
    navigate("/adminauthorall");
  }, [navigate]);

  const onAddAuthorClick = useCallback(() => {
    navigate("/adminauthoradd");
  }, [navigate]);

  const onAllAccountClick = useCallback(() => {
    navigate("/adminaccountall");
  }, [navigate]);

  const onAddAccountClick = useCallback(() => {
    navigate("/adminaccountadd");
  }, [navigate]);

  const onAllGroupClick = useCallback(() => {
    navigate("/admingroupall");
  }, [navigate]);

  const onAddGroupClick = useCallback(() => {
    navigate("/admingroupadd");
  }, [navigate]);

  const onAdminDeleteClick = useCallback(() => {
    navigate("/admindaxoaganday");
  }, [navigate]);

  const onAdminDeleteBookClick = useCallback(() => {
    navigate("/admindaxoagandaysach");
  }, [navigate]);

  const onAdminDeleteAuthorClick = useCallback(() => {
    navigate("/admindaxoagandaytacgia");
  }, [navigate]);

  const onAdminDeleteAccountClick = useCallback(() => {
    navigate("/admindaxoagandaytaikhoan");
  }, [navigate]);

  const onAdminDeleteGroupClick = useCallback(() => {
    navigate("/admindaxoagandaynhom");
  }, [navigate]);

  return (
    <div className={`${styles.paneldefault} ${isLeftExpanded ? styles.expanded : styles.collapsed}`}>
    <button className={styles.toggleButton} onClick={toggleLeftWidth}>
      {isLeftExpanded ? <FaChevronLeft /> : <FaChevronRight />}
    </button>
      <div className={styles.list}>
        <div className={styles.sch}>
          <div className={styles.sch1}>
            <img className={styles.book5Icon} alt="" src="/book-5.svg" />
            <b className={styles.sch2}>Sách</b>
          </div>
          <div className={styles.ttC} onClick={onAllBookClick}>
            <div className={styles.ttC1}>Tất cả</div>
          </div>
          <div className={styles.ttC} onClick={onAddBookClick}>
            <div className={styles.ttC1}>Thêm thông tin</div>
          </div>
        </div>
        <div className={styles.tcGi}>
          <div className={styles.sch1}>
            <img className={styles.faceIcon} alt="" src="/face.svg" />
            <div className={styles.tcGi2}>Tác giả</div>
          </div>
          <div className={styles.ttC2} onClick={onAllAuthorClick}>
            <div className={styles.ttC1}>Tất cả</div>
          </div>
          <div className={styles.ttC} onClick={onAddAuthorClick}>
            <div className={styles.ttC1}>Thêm thông tin</div>
          </div>
        </div>
        <div className={styles.tiKhon}>
          <div className={styles.sch1}>
            <img className={styles.faceIcon} alt="" src="/frame-person.svg" />
            <div className={styles.tcGi2}>Tài khoản</div>
          </div>
          <div className={styles.ttC} onClick={onAllAccountClick}>
            <div className={styles.ttC1}>Tất cả</div>
          </div>
          <div className={styles.ttC} onClick={onAddAccountClick}>
            <div className={styles.ttC1}>Thêm thông tin</div>
          </div>
        </div>
        <div className={styles.nhm}>
          <div className={styles.sch1}>
            <img className={styles.faceIcon} alt="" src="/diversity-3.svg" />
            <div className={styles.tcGi2}>Nhóm</div>
          </div>
          <div className={styles.ttC} onClick={onAllGroupClick}>
            <div className={styles.ttC1}>Tất cả</div>
          </div>
          <div className={styles.ttC} onClick={onAddGroupClick}>
            <div className={styles.ttC1}>Thêm thông tin</div>
          </div>
        </div>
        <div className={styles.xaGnY}>
          <div className={styles.xa} onClick={onAdminDeleteClick}>
            <img className={styles.faceIcon} alt="" src="/delete.svg" />
            <div className={styles.tcGi2}>Đã xóa gần đây</div>
          </div>
          <button className={styles.sch3} onClick={onAdminDeleteBookClick}>
            <div className={styles.sch4}>Sách</div>
          </button>
          <button className={styles.sch3} onClick={onAdminDeleteAuthorClick}>
            <div className={styles.sch4}>Tác giả</div>
          </button>
          <button className={styles.sch3} onClick={onAdminDeleteAccountClick}>
            <div className={styles.sch4}>Tài khoản</div>
          </button>
          <button className={styles.sch3} onClick={onAdminDeleteGroupClick}>
            <div className={styles.sch4}>Nhóm</div>
          </button>
        </div>
      </div>
    </div>
  );
});

PanelDefault.propTypes = {
  className: PropTypes.string,
};

export default PanelDefault;
