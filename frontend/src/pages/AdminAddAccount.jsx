import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Footer from "../components/Footer";
import styles from "./AdminAddAccount.module.css";

const TiKhonThmThngTin = () => {
  const location = useLocation();
  const [editable, setEditable] = useState(false);
  const [accountData, setAccountData] = useState({
    userId: "",
    userName: "",
    fullName: "",
    email: "",
    password: "",
    gender: "",
    region: "",
    birthDate: "",
    hobbies: "",
    introduction: "",
    avatar: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('id');
    const userName = params.get('username');
    const fullName = params.get('fullname');
    const email = params.get('email');
    const password = params.get('password');
    const gender = params.get('gender');
    const region = params.get('region');
    const birthDate = params.get('birthdate');
    const hobbies = params.get('hobbies');
    const introduction = params.get('intro');
    const createDate = params.get('createdate');
    const avatar = params.get('avatar');

    setAccountData({
      userId,
      userName,
      fullName,
      email,
      password,
      gender,
      region,
      birthDate,
      hobbies,
      introduction,
      createDate,
      avatar
    });

    const isEditable = params.get('editable');
    if (isEditable === 'true') {
      setEditable(true);
    }
  }, [location]);

  const validateForm = () => {
    const errors = [];
    if (!accountData.userName) errors.push("Tên người dùng không được để trống");
    if (!accountData.fullName) errors.push("Họ tên không được để trống");
    if (!accountData.email) errors.push("Email không được để trống");
    if (!accountData.password) errors.push("Mật khẩu không được để trống");
    if (!accountData.gender) errors.push("Giới tính không được để trống");
    if (!accountData.region) errors.push("Khu vực không được để trống");
    if (!accountData.birthDate) errors.push("Ngày sinh không được để trống");
    if (!accountData.hobbies) errors.push("Sở thích không được để trống");
    if (!accountData.introduction) errors.push("Giới thiệu không được để trống");
  
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }
  
    return true;
  };  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAccountData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSaveClick = async () => {
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');

    const formData = new FormData();
    for (const key in accountData) {
      formData.append(key, accountData[key]);
    }

    try {
      const response = await axios.post("http://localhost:3000/api/users/addusers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Thêm tài khoản thành công!");
      }
    } catch (error) {
      alert("Thêm tài khoản thất bại.");
      console.error("Lỗi:", error);
    }
  };

  const handleUpdateClick = async () => {
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      for (const key in accountData) {
        formData.append(key, accountData[key]);
      }

      const response = await axios.put(`http://localhost:3000/api/users/updateuser/${accountData.userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Cập nhật tài khoản thành công!");
        setEditable(false);
      }
    } catch (error) {
      alert("Cập nhật tài khoản thất bại.");
      console.error("Lỗi:", error);
    }
  };

  const handleEditClick = () => {
    setEditable(true);
  };

  return (
    <div className={styles.adminaccountadd}>
      <TopNavMana />
      <section className={styles.container}>
        <PanelDefault />
        <div className={styles.formcon}>
          <div className={styles.heading}>
            <div className={styles.thngTinTi}>Thông tin tài khoản</div>
            {!editable && (
              <button className={styles.edit} onClick={handleEditClick}>
                <img className={styles.editIcon} alt="" src="/edit.svg" />
                <div className={styles.sa}>Sửa</div>
              </button>
            )}
          </div>
          <div className={styles.form}>
            {[
              { label: "Tên người dùng", name: "userName" },
              { label: "Họ tên", name: "fullName" },
              { label: "Email", name: "email" },
              { label: "Mật khẩu", name: "password" },
              { label: "Giới tính", name: "gender" },
              { label: "Khu vực", name: "region" },
              { label: "Ngày sinh", name: "birthDate" },
              { label: "Sở thích", name: "hobbies" },
              { label: "Giới thiệu", name: "introduction", className: `${styles.textboxintro}`},
            ].map((field) => (
              <div className={styles.row} key={field.name}>
                <div className={styles.hd}>{field.label}</div>
                <textarea
                  className={field.className || styles.textbox}
                  name={field.name}
                  placeholder="Nhập dữ liệu"
                  value={accountData[field.name] || ""}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
            ))}
            <div className={styles.row}>
              <div className={styles.hd}>Ảnh đại diện</div>
              <div className={styles.imgContainer}>
                <input
                  className={styles.img}
                  type="file"
                  name="avatar"
                  onChange={handleChange}
                  disabled={!editable}
                />
                {accountData.avatar && (
                  <img
                    className={styles.coverPreview}
                    src={
                      typeof accountData.avatar === 'string' 
                        ? `/images/${accountData.avatar}` 
                        : URL.createObjectURL(accountData.avatar)
                    }
                    alt={accountData.fullName}
                  />
                )}
              </div>
            </div>
          </div>
          {editable && (
            <div className={styles.btnContainer}>
              <div className={styles.buttoncon}>
                <div className={styles.button} onClick={handleSaveClick}>
                  <div className={styles.luu}>Lưu</div>
                </div>
              </div>
              <div className={styles.buttoncon}>
                <div className={styles.button} onClick={handleUpdateClick}>
                  <div className={styles.luu}>Cập nhật</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TiKhonThmThngTin;
