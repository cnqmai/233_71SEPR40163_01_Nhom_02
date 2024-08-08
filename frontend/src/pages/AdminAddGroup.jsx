import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Footer from "../components/Footer";
import styles from "./AdminAddGroup.module.css";

const NhmThmThngTin = () => {
  const location = useLocation();
  const [editable, setEditable] = useState(false);
  const [userData, setUserData] = useState(null);
  const [groupData, setGroupData] = useState({
    groupId: "",
    groupName: "",
    admin: "",
    description: "",
    coverImage: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const groupId = params.get("id");
    const groupName = params.get("name");
    const admin = params.get("admin");
    const description = params.get("description");
    const avatar = params.get("avatar");

    setGroupData({
      groupId,
      groupName,
      admin,
      description,
      coverImage: avatar,
    });

    const isEditable = params.get("editable");
    if (isEditable === "true") {
      setEditable(true);
    }
  }, [location]);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); 
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/users/getuserbyid/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)

      setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }, []);

    useEffect(() => {
      fetchUserData();
    }, [fetchUserData]);
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setGroupData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    for (const key in groupData) {
      formData.append(key, groupData[key]);
    }

    try {
      const response = await axios.post("http://localhost:3000/api/groups/addgroup", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Thêm nhóm thành công!");
      }
    } catch (error) {
      alert("Thêm nhóm thất bại.");
      console.error("Lỗi:", error);
    }
  };

  const handleUpdateClick = async () => {
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      for (const key in groupData) {
        formData.append(key, groupData[key]);
      }

      const response = await axios.put(`http://localhost:3000/api/groups/updategroup/${groupData.groupId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Cập nhật nhóm thành công!");
        // Cập nhật trạng thái với tên ảnh mới nếu có
        setGroupData(prevData => ({
          ...prevData,
          coverImage: response.data.coverImage || prevData.coverImage
        }));
        setEditable(false);
      }
    } catch (error) {
      alert("Cập nhật nhóm thất bại.");
      console.error("Lỗi:", error);
    }
  };

  const handleEditClick = () => {
    setEditable(true);
  };

  return (
    <div className={styles.admingroupadd}>
      <TopNavMana />
      <div className={styles.container}>
        <PanelDefault />
        <div className={styles.formcon}>
          <div className={styles.heading}>
            <div className={styles.thngTinNhm}>Thông tin nhóm</div>
            {!editable && (
              <button className={styles.edit} onClick={handleEditClick}>
                <img className={styles.editIcon} alt="" src="/edit.svg" />
                <div className={styles.sa}>Sửa</div>
              </button>
            )}
          </div>
          <div className={styles.form}>
              {[
                { label: "Tên nhóm", name: "groupName" },
                { label: "Giới thiệu", name: "description", className: `${styles.textboxintro}` },
              ].map((field) => (
              <div className={styles.row} key={field.name}>
                <div className={styles.hd}>{field.label}</div>
                <textarea
                  className={field.className || styles.textbox}
                  name={field.name}
                  placeholder="Nhập dữ liệu"
                  value={groupData[field.name] || ""}
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
                  name="coverImage"
                  onChange={handleChange}
                  disabled={!editable}
                />
                {groupData.coverImage && (
                  <img
                    className={styles.coverPreview}
                    src={
                      typeof groupData.coverImage === "string"
                        ? `/images/${groupData.coverImage}`
                        : URL.createObjectURL(groupData.coverImage)
                    }
                    alt={groupData.groupName}
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
      </div>
      <Footer />
    </div>
  );
};

export default NhmThmThngTin;
