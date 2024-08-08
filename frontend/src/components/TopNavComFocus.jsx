import { memo, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./TopNav.module.css";
import { FaBars, FaTimes } from "react-icons/fa";

const TopNavCom = memo(
  ({ className = "", topNavWidth, topNavHeight, topNavGap }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const topNavStyle = useMemo(() => {
      return {
        width: topNavWidth,
        height: topNavHeight,
        gap: topNavGap,
      };
    }, [topNavWidth, topNavHeight, topNavGap]);

    const toggleMenu = () => {
      setMenuOpen((prevMenuOpen) => !prevMenuOpen);
    };

    useEffect(() => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        fetchUserData();
      }
    }, []);

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
        const userData = response.data;
        console.log('User Data:', userData); 
        setIsAdmin(userData.Admin === 1);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/dang-nhap');
    };

    return (
      <>
        <header
          className={[styles.topnav, className].join(" ")}
          style={topNavStyle}
        >
          <div className={styles.bookaboo}>
            <div className={styles.logo} onClick={() => navigate('/')}>bookaboo</div>
          </div>
          <nav className={styles.menu}>
            <div className={styles.button} onClick={() => navigate('/timkiem')}>
              <div className={styles.heading}>
                <div className={styles.title}>KHÁM PHÁ</div>
              </div>
            </div>
            <div className={styles.buttonFocus} onClick={() => navigate(`/group/${userId}`)}>
              <div className={styles.heading}>
                <div className={styles.title}>CỘNG ĐỒNG</div>
              </div>
            </div>
            <div className={styles.button} onClick={() => navigate(`/accountthuvien/${userId}`)}>
              <div className={styles.heading}>
                <div className={styles.title}>TÀI KHOẢN</div>
              </div>
            </div>
            {isAdmin && (
              <div className={styles.button} onClick={() => navigate('/admin')}>
                <div className={styles.heading}>
                  <div className={styles.title}>QUẢN LÝ</div>
                </div>
              </div>
            )}
            <div className={styles.button} onClick={handleLogout}>
              <div className={styles.heading}>
                <div className={styles.title}>ĐĂNG XUẤT</div>
              </div>
            </div>
          </nav>
          <div className={styles.hamburger} onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </header>
        <nav className={[styles.dropdownMenu, menuOpen ? styles.menuOpen : ""].join(" ")}>
          <div className={styles.DButton} onClick={() => navigate('/timkiem')}>
            <div className={styles.heading}>
              <div className={styles.title}>KHÁM PHÁ</div>
            </div>
          </div>
          <div className={styles.DButtonFocus} onClick={() => navigate(`/group/${userId}`)}>
            <div className={styles.heading}>
              <div className={styles.title}>CỘNG ĐỒNG</div>
            </div>
          </div>
          <div className={styles.DButton} onClick={() => navigate(`/accountthuvien/${userId}`)}>
            <div className={styles.heading}>
              <div className={styles.title}>TÀI KHOẢN</div>
            </div>
          </div>
          {isAdmin && (
            <div className={styles.DButton} onClick={() => navigate('/admin')}>
              <div className={styles.heading}>
                <div className={styles.title}>QUẢN LÝ</div>
              </div>
            </div>
          )}
            <div className={styles.DButton} onClick={handleLogout}>
              <div className={styles.heading}>
                <div className={styles.title}>ĐĂNG XUẤT</div>
              </div>
            </div>
        </nav>
      </>
    );
  }
);

TopNavCom.propTypes = {
  className: PropTypes.string,
  topNavWidth: PropTypes.any,
  topNavHeight: PropTypes.any,
  topNavGap: PropTypes.any,
};

export default TopNavCom;
