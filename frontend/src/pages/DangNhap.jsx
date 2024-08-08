import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DangNhap.module.css";
import axiosInstance from '../services/axiosInstance'; // Import the Axios instance

const DangNhap = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    TenTaiKhoan: '',
    MatKhau: ''
  });

  const onQunMtKhuClick = useCallback(() => {
    navigate("/quenmatkhau");
  }, [navigate]);

  const onFrameButtonClick = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', formData); // Use axiosInstance here
      alert(response.data.message);
      if (response.status === 200) {
        const { token, userId } = response.data;
        localStorage.setItem('token', token); // Store token
        localStorage.setItem('userId', userId); // Store user ID
        navigate(`/accountthuvien/${userId}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert(error.response?.data?.message || 'An unexpected error occurred');
    }
  }, [formData, navigate]);

  const onSignUpPageClick = useCallback(() => {
    navigate("/dangk");
  }, [navigate]);

  const onNgKClick = useCallback(() => {
    navigate("/dangk");
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className={styles.dangNhap}>
      <div className={styles.logo}>
        <div className={styles.bookaboo}>
          <div className={styles.bookaboo1} onClick={() => navigate('/')}>bookaboo</div>
        </div>
      </div>
      <div className={styles.none}>
        <form className={styles.formSignIn} onSubmit={onFrameButtonClick}>
          <div className={styles.signIn}>
            <div className={styles.dangnhap}>Đăng nhập</div>
            <div className={styles.inUpSignIn}>
              <div className={styles.nameemail}>
                <div className={styles.tnTiKhonemail}>Tên tài khoản/Email</div>
                <input
                  className={styles.inputname}
                  placeholder="Tên đăng nhập/Email"
                  type="text"
                  name="TenTaiKhoan"
                  value={formData.TenTaiKhoan}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.nameemail}>
                <div className={styles.mtKhu}>Mật khẩu</div>
                <input
                  className={styles.inpupass}
                  placeholder="********"
                  type="password"
                  name="MatKhau"
                  value={formData.MatKhau}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.forgetpasspage}>
                <a className={styles.qunMtKhu} onClick={onQunMtKhuClick}>
                  Quên mật khẩu?
                </a>
              </div>
              <div className={styles.buttonsignin}>
                <button
                  className={styles.ngNhpWrapper}
                  type="submit"
                >
                  <div className={styles.ngNhp}>Đăng nhập</div>
                </button>
              </div>
            </div>
            <div className={styles.quesSignIn}>
              <img className={styles.quesSignInChild} alt="" />
              <div className={styles.questionRegister}>
                <div className={styles.chaCTi}>Chưa có tài khoản?</div>
                <button
                  className={styles.signuppage}
                  onClick={onSignUpPageClick}
                >
                  <a className={styles.ngK} onClick={onNgKClick}>
                    Đăng ký
                  </a>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DangNhap;
