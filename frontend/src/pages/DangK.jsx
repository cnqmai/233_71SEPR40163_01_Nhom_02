import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./DangK.module.css";
import axios from "axios";

const DangK = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    TenTaiKhoan: '',
    HoTen: '',
    Email: '',
    MatKhau: '',
    NhapLaiMatKhau: ''
  });

  const validateEmail = (email) => {
    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Kiểm tra mật khẩu có ít nhất 6 ký tự, bao gồm chữ cái và số
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const validateTenTaiKhoan = (tenTaiKhoan) => {
    // Kiểm tra tên tài khoản không chứa ký tự đặc biệt hoặc khoảng trắng
    const usernameRegex = /^[\p{L}\p{N}]+$/u; // Cho phép chữ cái (bao gồm tiếng Việt) và số, không có khoảng trắng hoặc ký tự đặc biệt
    return usernameRegex.test(tenTaiKhoan);
  };

  const onFrameButtonClick = useCallback(async (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu và nhập lại mật khẩu
    if (formData.MatKhau !== formData.NhapLaiMatKhau) {
      alert('Mật khẩu và nhập lại mật khẩu không khớp');
      return;
    }

    // Kiểm tra định dạng email
    if (!validateEmail(formData.Email)) {
      alert('Định dạng email không hợp lệ');
      return;
    }

    // Kiểm tra định dạng mật khẩu
    if (!validatePassword(formData.MatKhau)) {
      alert('Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và số');
      return;
    }

    // Kiểm tra tên tài khoản
    if (!validateTenTaiKhoan(formData.TenTaiKhoan)) {
      alert('Tên tài khoản không hợp lệ: không chứa ký tự đặc biệt hoặc khoảng trắng');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', formData);
      alert(response.data.message);
      navigate('/dang-nhap');
    } catch (error) {
      console.error('Error during registration:', error);
      alert(error.response ? error.response.data.message : 'An unexpected error occurred');
    }
  }, [formData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className={styles.dangKy}>
      <div className={styles.logo}>
        <div className={styles.bookaboo}>
          <div className={styles.bookaboo1} onClick={() => navigate('/')}>bookaboo</div>
        </div>
      </div>
      <div className={styles.none1}>
        <form className={styles.formSignUp}>
          <div className={styles.signUp}>
            <div className={styles.dangky}>Đăng ký</div>
            <div className={styles.inUpSignUp}>
              <div className={styles.inputsignup}>
                <div className={styles.tnTiKhonParent}>
                  <div className={styles.tnTiKhon}>Tên tài khoản</div>
                  <input
                    className={styles.frameChild}
                    placeholder="Tên tài khoản"
                    type="text"
                    name="TenTaiKhoan"
                    value={formData.TenTaiKhoan}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.hVTnParent}>
                  <div className={styles.tnTiKhon}>{`Họ và tên `}</div>
                  <input
                    className={styles.frameChild}
                    placeholder="Họ và Tên"
                    type="text"
                    name="HoTen"
                    value={formData.HoTen}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.tnTiKhonParent}>
                  <div className={styles.tnTiKhon}>Email</div>
                  <input
                    className={styles.frameChild}
                    placeholder="Abc@gmail.com"
                    type="text"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.tnTiKhonParent}>
                  <div className={styles.tnTiKhon}>Mật khẩu</div>
                  <input
                    className={styles.frameInput}
                    type="password"
                    name="MatKhau"
                    value={formData.MatKhau}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.tnTiKhonParent}>
                  <div className={styles.tnTiKhon}>Nhập lại mật khẩu</div>
                  <input
                    className={styles.frameInput}
                    type="password"
                    name="NhapLaiMatKhau"
                    value={formData.NhapLaiMatKhau}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className={styles.inUpSignUpInner}>
                <button
                  className={styles.ngKWrapper}
                  onClick={onFrameButtonClick}
                >
                  <div className={styles.ngK}>Đăng ký</div>
                </button>
              </div>
            </div>
            <div className={styles.lineParent}>
              <img className={styles.lineIcon} alt="" />
              <div className={styles.inUpSignUpInner}>
                <div className={styles.cTiKhonParent}>
                  <div className={styles.cTiKhon}>Đã có tài khoản?</div>
                  <button
                    className={styles.ngNhpWrapper}
                    onClick={() => navigate('/dang-nhap')}
                  >
                    <Link className={styles.ngNhp} to="/dang-nhap">
                      Đăng nhập
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DangK;
