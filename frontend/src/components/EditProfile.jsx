import { memo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DatetimeDay from "./DatetimeDay";
import PropTypes from "prop-types";
import styles from "./EditProfile.module.css";

const EditProfile = memo(({ className = "", onClose, userId: propUserId }) => {
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();

  // Dùng userId từ props nếu có, nếu không thì dùng từ params
  const userId = propUserId || paramUserId;

  // State để lưu trữ dữ liệu form
  const [tenTaiKhoan, setTenTaiKhoan] = useState("");
  const [ho, setHo] = useState("");
  const [ten, setTen] = useState("");
  const [gioiTinh, setGioiTinh] = useState("Nam");
  const [ngaySinh, setNgaySinh] = useState({ day: "", month: "", year: "" });
  const [thanhPho, setThanhPho] = useState("");
  const [soThich, setSoThich] = useState("");
  const [gioiThieu, setGioiThieu] = useState("");
  const [avatar, setAvatar] = useState(null); // Thêm state để lưu trữ ảnh đại diện

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]); // Cập nhật state khi người dùng chọn tệp
  };

  const handleSave = useCallback(async () => {
    const fullName = `${ho} ${ten}`;

    const formData = new FormData();
    if (tenTaiKhoan) formData.append("tenTaiKhoan", tenTaiKhoan);
    if (fullName.trim()) formData.append("fullName", fullName);
    if (gioiTinh) formData.append("gioiTinh", gioiTinh);
    if (ngaySinh.day || ngaySinh.month || ngaySinh.year) formData.append("ngaySinh", JSON.stringify(ngaySinh));
    if (thanhPho) formData.append("thanhPho", thanhPho);
    if (soThich) formData.append("soThich", soThich);
    if (gioiThieu) formData.append("gioiThieu", gioiThieu);
    
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/users/updateprofile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Đặt header Content-Type cho FormData
        },
      });

      if (response.status === 200) {
        alert("Thông tin đã được cập nhật!");
        navigate(0);
      } else {
        alert("Cập nhật thất bại! Vui lòng kiểm tra lại thông tin.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Đã xảy ra lỗi! Vui lòng thử lại sau.");
    }
  }, [tenTaiKhoan, ho, ten, gioiTinh, ngaySinh, thanhPho, soThich, gioiThieu, avatar, navigate, userId]);

  return (
    <div className={[styles.editProfile, className].join(" ")}>
      <div className={styles.formeditprofile}>
        <div className={styles.top}>
          <div className={styles.button}>
            <button className={styles.image7Wrapper} onClick={onClose}>
              <img className={styles.image7} alt="close" src="/vector-200.svg" />
            </button>
            <button className={styles.button1} onClick={handleSave}>
              <div className={styles.title}>Lưu</div>
            </button>
          </div>
          <div className={styles.heading}>
            <img className={styles.headingChild} alt="" src="/vector-201.svg" />
            <div className={styles.thngTin}>Thông tin</div>
            <img className={styles.headingItem} alt="" src="/vector-2001.svg" />
          </div>
        </div>
        <div className={styles.inputprofile}>
          <div className={styles.avatarParent}>
            <div className={styles.avatar}>
              <img className={styles.avatarChild} alt="" src="/UnknownUser.jpg" />
              <input
                className={styles.iconEdit}
                type="file"
                onChange={handleFileChange} // Xử lý thay đổi tệp
              />
            </div>
            <form className={styles.info}>
              <div className={styles.headingParent}>
                <div className={styles.heading1}>
                  <div className={styles.tnTiKhon}>Tên tài khoản</div>
                </div>
                <input
                  className={styles.textbox}
                  type="text"
                  value={tenTaiKhoan}
                  onChange={(e) => setTenTaiKhoan(e.target.value)}
                />
              </div>
              <div className={styles.headingParent}>
                <div className={styles.heading1}>
                  <div className={styles.tnTiKhon}>Họ</div>
                </div>
                <input
                  className={styles.textbox}
                  type="text"
                  value={ho}
                  onChange={(e) => setHo(e.target.value)}
                />
              </div>
              <div className={styles.headingParent}>
                <div className={styles.heading1}>
                  <div className={styles.tnTiKhon}>Tên</div>
                </div>
                <input
                  className={styles.textbox}
                  type="text"
                  value={ten}
                  onChange={(e) => setTen(e.target.value)}
                />
              </div>
              <div className={styles.headingParent}>
                <div className={styles.heading1}>
                  <div className={styles.tnTiKhon}>Giới tính</div>
                </div>
                <select
                  className={styles.options}
                  value={gioiTinh}
                  onChange={(e) => setGioiTinh(e.target.value)}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </form>
          </div>
          <form className={styles.ngySinhParent}>
            <div className={styles.ngySinh}>
              <div className={styles.linkLinKt}>Ngày sinh</div>
              <div className={styles.option}>
                <div className={styles.ngy}>
                  <div className={styles.ngy1}>Ngày</div>
                  <DatetimeDay value={ngaySinh.day} onChange={(day) => setNgaySinh({ ...ngaySinh, day })} />
                </div>
                <div className={styles.thng}>
                  <div className={styles.ngy1}>Tháng</div>
                  <select
                    className={styles.option1}
                    value={ngaySinh.month}
                    onChange={(e) => setNgaySinh({ ...ngaySinh, month: e.target.value })}
                    required
                  >
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
                <div className={styles.nm}>
                  <div className={styles.ngy1}>Năm</div>
                  <select
                    className={styles.option1}
                    value={ngaySinh.year}
                    onChange={(e) => setNgaySinh({ ...ngaySinh, year: e.target.value })}
                    required
                  >
                    <option value="2000">2000</option>
                    <option value="1999">1999</option>
                    <option value="1998">1998</option>
                    <option value="1997">1997</option>
                    <option value="1996">1996</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.headingParent}>
              <div className={styles.heading1}>
                <div className={styles.tnTiKhon}>Thành phố</div>
              </div>
              <input
                className={styles.textbox}
                type="text"
                value={thanhPho}
                onChange={(e) => setThanhPho(e.target.value)}
              />
            </div>
            <div className={styles.headingParent}>
              <div className={styles.heading1}>
                <div className={styles.tnTiKhon}>Sở thích</div>
              </div>
              <input
                className={styles.textbox}
                type="text"
                value={soThich}
                onChange={(e) => setSoThich(e.target.value)}
              />
            </div>
            <div className={styles.headingParent}>
              <div className={styles.heading1}>
                <div className={styles.tnTiKhon}>Giới thiệu</div>
              </div>
              <input
                className={styles.textbox}
                type="text"
                value={gioiThieu}
                onChange={(e) => setGioiThieu(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

EditProfile.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  userId: PropTypes.string,
};

export default EditProfile;
