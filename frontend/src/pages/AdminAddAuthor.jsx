import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Footer from "../components/Footer";
import styles from "./AdminAddAuthor.module.css";

const TcGiThmThngTin = () => {
  const location = useLocation();
  const [editable, setEditable] = useState(false);
  const [authorData, setAuthorData] = useState({
    authorId: "",
    authorName: "",
    birthPlace: "",
    birthDate: "",
    introduction: "",
    works: "", // Đây là một ObjectId, nên không thể sửa
    authorImage: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authorId = params.get('id');
    const authorName = params.get('name');
    const birthPlace = params.get('birthplace');
    const birthDate = params.get('birthdate');
    const introduction = params.get('introduction');
    const works = params.get('works'); // Đây là một ObjectId, nên không thể sửa
    const authorImage = params.get('image');

    setAuthorData({
      authorId,
      authorName,
      birthPlace,
      birthDate,
      introduction,
      works,
      authorImage
    });

    const isEditable = params.get('editable');
    if (isEditable === 'true') {
      setEditable(true);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAuthorData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const validateForm = () => {
    const { authorName, birthPlace, birthDate, introduction } = authorData;
  
    // Kiểm tra xem tất cả các trường quan trọng có được điền không
    if (!authorName || !birthPlace || !birthDate || !introduction) {
      alert("Thông tin không được để trống đầy đủ!");
      return false;
    }
  
    // Nếu tất cả các kiểm tra đều thành công
    return true;
  };
  

  const handleSaveClick = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    for (const key in authorData) {
      if (key !== 'works') { // Không gửi trường 'works' vì nó là ObjectId
        formData.append(key, authorData[key]);
      }
    }

    try {
      const response = await axios.post("http://localhost:3000/api/authors/addauthors", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Thêm tác giả thành công!");
      }
    } catch (error) {
      alert("Thêm tác giả thất bại.");
      console.error("Lỗi:", error);
    }
  };

  const handleUpdateClick = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    for (const key in authorData) {
      if (key !== 'works') { // Không gửi trường 'works' vì nó là ObjectId
        formData.append(key, authorData[key]);
      }
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/authors/updateauthor/${authorData.authorId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Cập nhật tác giả thành công!");
        setEditable(false);
      }
    } catch (error) {
      alert("Cập nhật tác giả thất bại.");
      console.error("Lỗi:", error);
    }
  };

  const handleEditClick = () => {
    setEditable(true);
  };

  return (
    <div className={styles.adminauthoradd}>
      <TopNavMana />
      <section className={styles.container}>
        <PanelDefault />
        <div className={styles.formcon}>
          <div className={styles.heading}>
            <div className={styles.thngTinTc}>Thông tin tác giả</div>
            {!editable && (
              <button className={styles.edit} onClick={handleEditClick}>
                <img className={styles.editIcon} alt="" src="/edit.svg" />
                <div className={styles.sa}>Sửa</div>
              </button>
            )}
          </div>
          <div className={styles.form}>
            {[
              { label: "ID Tác giả", name: "authorId", readOnly: true },
              { label: "Tên tác giả", name: "authorName" },
              { label: "Nơi sinh", name: "birthPlace" },
              { label: "Ngày sinh", name: "birthDate" },
              { label: "Giới thiệu", name: "introduction", className: `${styles.textboxintro}` },
              { label: "Tác phẩm", name: "works", readOnly: true }, // Hiển thị thông tin nhưng không cho sửa
            ].map((field) => (
              <div className={styles.row} key={field.name}>
                <div className={styles.hd}>{field.label}</div>
                <textarea
                  className={field.className || styles.textbox}
                  name={field.name}
                  placeholder="Nhập dữ liệu"
                  value={authorData[field.name] || ""}
                  onChange={handleChange}
                  readOnly={!editable || field.readOnly}
                />
              </div>
            ))}
            <div className={styles.row}>
              <div className={styles.hd}>Hình ảnh</div>
              <div className={styles.imgContainer}>
                <input
                  className={styles.img}
                  type="file"
                  name="authorImage"
                  onChange={handleChange}
                  disabled={!editable}
                />
                {authorData.authorImage && (
                  <img
                    className={styles.coverPreview}
                    src={
                      typeof authorData.authorImage === 'string' 
                        ? `/images/${authorData.authorImage}` 
                        : URL.createObjectURL(authorData.authorImage)
                    }
                    alt={authorData.authorName}
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

export default TcGiThmThngTin;
