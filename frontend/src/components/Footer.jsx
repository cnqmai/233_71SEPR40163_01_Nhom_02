import { memo, useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Footer.module.css";
import { useNavigate } from "react-router-dom";

const Footer = memo(
  ({ className = "", bookabooMargin, vChngTiFontSize, bnQuynFontSize }) => {
    const navigate = useNavigate();

    const bookabooStyle = useMemo(() => {
      return {
        margin: bookabooMargin,
      };
    }, [bookabooMargin]);

    const vChngTiStyle = useMemo(() => {
      return {
        fontSize: vChngTiFontSize,
      };
    }, [vChngTiFontSize]);

    const bnQuynStyle = useMemo(() => {
      return {
        fontSize: bnQuynFontSize,
      };
    }, [bnQuynFontSize]);

    return (
      <div className={[styles.footer, className].join(" ")}>
        <div className={styles.logo}>
          <div className={styles.bookaboo} style={bookabooStyle}>
            bookaboo
          </div>
          <i className={styles.nnTngDnh}>
            Nền tảng dành cho cộng đồng đam mê sách và văn học.
          </i>
        </div>
        <div className={styles.link}>
          <b
            className={styles.vChngTi}
            style={vChngTiStyle}
            onClick={() => navigate("/aboutus")}
          >
            Về chúng tôi
          </b>
        </div>
        <b className={styles.vChngTi} style={bnQuynStyle}>
          Bản quyền © 2024 Bookaboo. Tất cả các quyền được bảo lưu.
        </b>
      </div>
    );
  },
);

Footer.propTypes = {
  className: PropTypes.string,

  /** Style props */
  bookabooMargin: PropTypes.any,
  vChngTiFontSize: PropTypes.any,
  bnQuynFontSize: PropTypes.any,
};

export default Footer;
