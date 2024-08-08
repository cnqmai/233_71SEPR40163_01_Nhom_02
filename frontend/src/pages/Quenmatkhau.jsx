import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Quenmatkhau.module.css";
import axiosInstance from '../services/axiosInstance';

const Quenmatkhau = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onBtnHuyClick = useCallback(() => {
    navigate("/dang-nhap");
  }, [navigate]);

  const onBtnTiepTucClick = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/forgotpassword', { email }); // Gửi email đến API
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage(error.response?.data?.message || 'An unexpected error occurred');
    }
  }, [email, navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className={styles.quenmatkhau}>
      <div className={styles.bookaboo}>
        <div className={styles.bookaboo1} onClick={() => navigate('/')}>bookaboo</div>
      </div>
      <div className={styles.formnhapemailquenmk}>
        <form className={styles.formquenmatkhau} onSubmit={onBtnTiepTucClick}>
          <div className={styles.quenmatkhau1}>
            <p className={styles.qunMtKhu}>Quên mật khẩu</p>
          </div>
          <div className={styles.emailquenmatkhau}>
            <div className={styles.email}>Email</div>
            <div className={styles.abcgmailcomWrapper}>
              <input
                className={styles.abcgmailcom}
                placeholder="abc@gmail.com"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
          </div>
          <div className={styles.buttonHuyTt}>
            <button type="button" className={styles.btnhuy} onClick={onBtnHuyClick}>
              <div className={styles.hy}>Hủy</div>
            </button>
            <button type="submit" className={styles.btntieptuc}>
              <div className={styles.tipTc}>Tiếp tục</div>
            </button>
          </div>
          {message && <div className={styles.message}>{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default Quenmatkhau;
