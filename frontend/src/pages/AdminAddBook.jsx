import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Footer from "../components/Footer";
import styles from "./AdminAddBook.module.css";

const SchThmThngTin = () => {
  const location = useLocation();
  const [editable, setEditable] = useState(false);
  const [bookData, setBookData] = useState({
    bookId: "",
    bookName: "",
    authorName: "",
    category: "",
    publishDate: "",
    coverType: "",
    language: "",
    pageCount: "",
    context: "",
    summary: "",
    coverImage: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookId = params.get('id');
    const bookName = params.get('title');
    const authorName = params.get('author');
    const category = params.get('category');
    const publishDate = params.get('publishdate');
    const coverType = params.get('covertype');
    const language = params.get('language');
    const pageCount = params.get('page');
    const context = params.get('context');
    const summary = params.get('summary');
    const coverImage = params.get('cover');

    setBookData({
      bookId,
      bookName,
      authorName,
      category,
      publishDate,
      coverType,
      language,
      pageCount,
      context,
      summary,
      coverImage
    });

    // Kiểm tra xem có phải từ trang panel để quyết định có cho phép chỉnh sửa hay không
    const isEditable = params.get('editable');
    if (isEditable === 'true') {
      setEditable(true);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    for (const key in bookData) {
      formData.append(key, bookData[key]);
    }

    try {
      const response = await axios.post("http://localhost:3000/api/books/addbooks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Thêm sách thành công!");
      }
    } catch (error) {
      alert("Thêm sách thất bại.");
      console.error("Lỗi:", error);
    }
  };

  const handleUpdateClick = async () => {
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      for (const key in bookData) {
        formData.append(key, bookData[key]);
      }

      const response = await axios.put(`http://localhost:3000/api/books/updatebook/${bookData.bookId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Cập nhật sách thành công!");
        setEditable(false); // Quay lại chế độ xem sau khi cập nhật thành công
      }
    } catch (error) {
      alert("Cập nhật sách thất bại.");
      console.error("Lỗi:", error);
    }
  };

  const handleEditClick = () => {
    setEditable(true); // Kích hoạt chế độ chỉnh sửa khi nhấn vào nút Sửa
  };

  return (
    <div className={styles.adminbookadd}>
      <TopNavMana />
      <div className={styles.container}>
        <PanelDefault />
        <div className={styles.formcon}>
          <div className={styles.heading}>
            <div className={styles.thngTinSch}>Thông tin sách</div>
            {!editable && ( // Hiển thị nút Sửa khi chưa ở chế độ chỉnh sửa
              <button className={styles.edit} onClick={handleEditClick}>
                <img className={styles.editIcon} alt="" src="/edit.svg" />
                <div className={styles.sa}>Sửa</div>
              </button>
            )}
          </div>
          <div className={styles.form}>
            {[
              { label: "ID Sách", name: "bookId" },
              { label: "Tên sách", name: "bookName" },
              { label: "Tên tác giả", name: "authorName" },
              { label: "Thể loại", name: "category" },
              { label: "Ngày xuất bản", name: "publishDate" },
              { label: "Loại bìa", name: "coverType" },
              { label: "Ngôn ngữ", name: "language" },
              { label: "Số trang", name: "pageCount" },
              { label: "Bối cảnh", name: "context" },
              { label: "Tóm tắt", name: "summary", className: `${styles.textboxsum}`},
            ].map((field) => (
              <div className={styles.row} key={field.name}>
                <div className={styles.hd}>{field.label}</div>
                <textarea
                  className={field.className || styles.textbox}
                  name={field.name}
                  placeholder="Nhập dữ liệu"
                  value={bookData[field.name] || ""}
                  onChange={handleChange}
                  readOnly={!editable} // Đặt readOnly dựa vào trạng thái editable
                />
              </div>
            ))}
            <div className={styles.row}>
              <div className={styles.hd}>Ảnh bìa</div>
              <div className={styles.imgContainer}>
                <input
                  className={styles.img}
                  type="file"
                  name="coverImage"
                  onChange={handleChange}
                  disabled={!editable} // Cho phép chỉnh sửa khi ở chế độ editable
                />
                {bookData.coverImage && (
                  <img
                    className={styles.coverPreview}
                    src={
                      typeof bookData.coverImage === 'string' 
                        ? `/images/${bookData.coverImage}` 
                        : URL.createObjectURL(bookData.coverImage)
                    }
                    alt={bookData.bookName}
                  />
                )}
              </div>
            </div>
          </div>
          {editable && ( // Hiển thị nút Lưu và Cập nhật chỉ khi ở chế độ chỉnh sửa
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

export default SchThmThngTin;
