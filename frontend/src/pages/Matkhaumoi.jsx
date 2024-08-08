import { useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from '../services/axiosInstance'; // Đảm bảo rằng bạn đã cấu hình axiosInstance đúng
import styles from "./Matkhaumoi.module.css";

const Matkhaumoi = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  // Lấy token từ URL khi component được render
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage('Token không hợp lệ');
    }
  }, [location.search]);

  const onBtnXacNhanClick = useCallback(async (e) => {
    e.preventDefault();

    // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp không
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      // Gửi yêu cầu đến API để đặt lại mật khẩu
      if (!token) {
        setMessage('Token không hợp lệ');
        return;
      }

      const response = await axiosInstance.post(`/api/auth/resetpassword/${token}`, { newPassword });
      setMessage(response.data.message);
      if (response.status === 200) {
        navigate("/dang-nhap"); // Điều hướng đến trang đăng nhập nếu thành công
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage(error.response?.data?.message || 'Đã xảy ra lỗi không mong muốn');
    }
  }, [newPassword, confirmPassword, navigate, token]);

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className={styles.matkhaumoi}>
      <div className={styles.bookaboo}>
        <div className={styles.bookaboo1} onClick={() => navigate('/')}>bookaboo</div>
      </div>
      <div className={styles.matkhaumoiform}>
        <form className={styles.formmatkhaumoi} onSubmit={onBtnXacNhanClick}>
          <div className={styles.nhapmatkhaumoi}>
            <p className={styles.nhpMtKhu}>Nhập mật khẩu mới</p>
          </div>
          <div className={styles.inputmatkhau}>
            <div className={styles.mtKhuMi}>Mật khẩu mới</div>
            <input
              className={styles.inputmatkhauChild}
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
          </div>
          <div className={styles.inputmatkhau}>
            <div className={styles.mtKhuMi}>Nhập lại mật khẩu</div>
            <input
              className={styles.inputmatkhauChild}
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <div className={styles.buttonxacnhan}>
            <button type="submit" className={styles.btnxacnhan}>
              <div className={styles.xcNhn}>Xác nhận</div>
            </button>
          </div>
          {message && <div className={styles.message}>{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default Matkhaumoi;
