import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TopNavCom from "../components/TopNavComFocus";
import Footer from "../components/Footer";
import styles from "./GroupCreate.module.css";

const GroupCreat = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); 
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("Công khai");
  const [avatar, setAvatar] = useState(null);
  
  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleCreateGroup = async (e) => {
    const token = localStorage.getItem('token');

    e.preventDefault();

    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("description", description);
    formData.append("privacy", privacy);
    if (avatar) {
      formData.append("coverImage", avatar);
      console.log('FormData coverImage:', avatar);
    }
    try {
        const response = await axios.post(`http://localhost:3000/api/groups/usercreategroup/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          alert("Tạo nhóm thành công");
          navigate(`/groupthaoluan/${userId}/${response.data.TenNhom}`);
        }
      } catch (error) {
        console.error("Error creating group:", error);
      }
  };

  const handleCancel = () => {
    // Đặt lại các trạng thái
    setGroupName("");
    setDescription("");
    setPrivacy("Công khai");
    setAvatar(null);
    // Tải lại trang hiện tại
    navigate(0);
  };

  return (
    <div className={styles.groupcreat}>
      <TopNavCom />
      <div className={styles.body}>
        <div className={styles.toNhm}>Tạo nhóm</div>
        <div className={styles.inputprofile}>
          <div className={styles.avatar}>
            <img
              className={styles.avatarChild}
              alt=""
              src={avatar ? URL.createObjectURL(avatar) : "/images/DefaultGroup.png"}
            />
            <input className={styles.iconEdit} type="file" name="coverImage" onChange={handleFileChange} /> 
          </div>
          <form className={styles.info} onSubmit={handleCreateGroup}>
            <div className={styles.tnNhmParent}>
              <div className={styles.tnNhm}>Tên nhóm</div>
              <input
                className={styles.textbox}
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
            <div className={styles.giiThiu}>
              <div className={styles.giiThiu1}>Giới thiệu</div>
              <textarea
                className={styles.textbox1}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className={styles.giiThiu}>
              <div className={styles.chnQuynRing}>Chọn quyền riêng tư</div>
              <select
                className={styles.textbox2}
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <option value="Công khai">Công khai</option>
                <option value="Riêng tư">Riêng tư</option>
              </select>
            </div>
            <div className={styles.button}>
            <button className={styles.button1} type="button" onClick={handleCancel}>
              <div className={styles.title}>Hủy</div>
            </button>
            <button className={styles.button1} type="submit"> 
              <div className={styles.title}>Tạo nhóm</div>
            </button>
          </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GroupCreat;

