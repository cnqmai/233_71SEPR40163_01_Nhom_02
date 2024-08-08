import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { format } from 'date-fns';
import TopNavDisc from "../components/TopNavDiscFocus";
import BookIllu from "../components/BookIllu";
import BookCard from "../components/BookCard";
import Footer from "../components/Footer";
import styles from "./Sach.module.css";

const Sach = () => {
    const { name } = useParams(); // Lấy tên sách từ URL
    const [bookData, setBookData] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [status, setStatus] = useState(""); // Trạng thái sách
    const [reviewContent, setReviewContent] = useState(""); // Nội dung đánh giá
    const [reviewRating, setReviewRating] = useState(1); // Điểm đánh giá
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchBookData = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await axios.get(`http://localhost:3000/api/books/getbookbyname/${name}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                setBookData(response.data);
            } catch (error) {
                console.error('Error fetching book data:', error);
            }
        };

        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
        
            if (!token) {
                console.error('Token is missing');
                return;
            }
        
            try {
                const response = await axios.get('http://localhost:3000/api/users/getuser', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchBookData();
        fetchUserData();
    }, [name]);

    const handleStatusChange = async (event) => {
        const token = localStorage.getItem('token');

        const newStatus = event.target.value;
        setStatus(newStatus);

        try {
            await axios.post(`http://localhost:3000/api/users/updatebookstatus`, {
                bookId: bookData?._id,
                status: newStatus,
            }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error updating book status:', error);
        }
    };

    const parseDateString = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
    };

    const renderStars = (rating) => {
        const totalStars = 5;
        const filledStars = Math.round(rating);
        const stars = [];
        const filledStarSrc = "/star-1.svg";

        for (let i = 0; i < filledStars; i++) {
            stars.push(
                <img
                    key={i}
                    className={styles.rateChild}
                    alt="star"
                    src={filledStarSrc}
                />
            );
        }

        return stars;
    };

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const total = reviews.reduce((acc, review) => acc + review.SoDiem, 0);
        return total / reviews.length;
    };

    const handleReviewSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:3000/api/reviews/addreviewforbook`, {
                bookId: bookData?._id,
                reviewContent,
                reviewRating
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Fetch updated book data
            const response = await axios.get(`http://localhost:3000/api/books/getbookbyname/${name}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookData(response.data);
            setReviewContent(""); // Reset review content
            setReviewRating(1); // Reset review rating
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    if (!bookData) {
        return <div>Loading...</div>;
    }

    const bookDate = parseDateString(bookData.NgayXB);
    const formattedDate = bookDate ? format(bookDate, 'dd/MM/yyyy') : 'N/A';

    // Tính điểm trung bình
    const averageRating = calculateAverageRating(bookData.DanhGia);

    return (
        <div className={styles.sach}>
            <TopNavDisc />
            <main className={styles.body}>
                <section className={styles.thngTinSch}>
                    <div className={styles.left}>
                        <img
                            className={styles.bookcover}
                            alt=""
                            src={`/images/${bookData.AnhBia}`}
                        />
                        <form className={styles.tnhTrng}>
                            <select
                                className={styles.options}
                                value={status}
                                onChange={handleStatusChange}
                            >
                                <option value="">Thêm vào thư viện</option>
                                <option value="Muốn đọc">Muốn đọc</option>
                                <option value="Đang đọc">Đang đọc</option>
                                <option value="Đã đọc">Đã đọc</option>
                            </select>
                        </form>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.rateParent}>
                            <div className={styles.rate}>
                                {renderStars(averageRating)}
                            </div>
                            <div className={styles.title}>{bookData.TieuDe}</div>
                            <div className={styles.author}>
                                {bookData.TacGia && bookData.TacGia.length > 0 ? (
                                    <Link to={`/author/${bookData.TacGia[0].HoTen}`}>
                                        {bookData.TacGia[0].HoTen || 'Tên tác giả không có'}
                                    </Link>
                                ) : (
                                    'Thông tin tác giả không có'
                                )}
                            </div>
                        </div>
                        <div className={styles.thngTin}>
                            <div className={styles.infoRow}>
                                <div className={styles.heading}>Thể loại</div>
                                <div className={styles.infoText}>{bookData.TheLoai.join(', ')}</div>
                            </div>
                            <div className={styles.infoRow}>
                                <div className={styles.heading}>Số trang</div>
                                <div className={styles.infoText}>{bookData.SoTrang}</div>
                            </div>
                            <div className={styles.infoRow}>
                                <div className={styles.heading}>Bìa</div>
                                <div className={styles.infoText}>{bookData.LoaiBia}</div>
                            </div>
                            <div className={styles.infoRow}>
                                <div className={styles.heading}>Ngôn ngữ</div>
                                <div className={styles.infoText}>{bookData.NgonNgu}</div>
                            </div>
                            <div className={styles.infoRow}>
                                <div className={styles.heading}>Ngày xuất bản</div>
                                <div className={styles.infoText}>{formattedDate}</div>
                            </div>
                            <div className={styles.infoRow}>
                                <div className={styles.heading}>Bối cảnh</div>
                                <div className={styles.infoText}>{bookData.BoiCanh ? bookData.BoiCanh : 'N/A'}</div>
                            </div>
                        </div>
                        <div className={styles.summary}>{bookData.TomTat}</div>
                    </div>
                </section>
                <section className={styles.deXuatSach}>
                    <h3 className={styles.h3}>Đề xuất tương tự</h3>
                    <div className={styles.bookIlluParent}>
                        <BookIllu genre={bookData.TheLoai[0]} onBookSelect={setSelectedBook} />
                        <BookCard book={selectedBook} />
                    </div>
                </section>
                <section className={styles.danhGia}>
                    <div className={styles.danhGiaParent}>
                        <h3 className={styles.h3}>Đánh giá</h3>
                        <div className={styles.subh3}>({bookData.DanhGia?.length || 0} đánh giá)</div>
                    </div>
         
                    <div className={styles.myReview}>
                        <div className={styles.ava_name}>
                            <div className={styles.ava}>
                                <img className={styles.ava} src={userData?.AnhDaiDien ? `/images/${userData.AnhDaiDien}` : '/UnknownUser.jpg'} alt="avatar" />
                            </div>
                            <div className={styles.name}>{userData.TenTaiKhoan}</div>
                        </div>
                        <div className={styles.rate_review}>
                            <div className={styles.myRate}>
                                <label htmlFor="ratingInput">Số Điểm</label>
                                <input
                                    id="ratingInput"
                                    className={styles.ratingInput}
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={reviewRating}
                                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                                />
                            </div>
                            <form className={styles.myForm} onSubmit={handleReviewSubmit}>
                                <textarea
                                    className={styles.myTextarea}
                                    placeholder="Viết đánh giá của bạn..."
                                    value={reviewContent}
                                    onChange={(e) => setReviewContent(e.target.value)}
                                ></textarea>
                                <button className={styles.submitButton} type="submit">
                                    Gửi đánh giá
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className={styles.itemParent}>
                        {bookData.DanhGia?.map((review, index) => (
                            <div key={index} className={styles.item}>
                                <div className={styles.ava}>
                                    <img className={styles.ava} src={review.userId?.AnhDaiDien ? `/images/${review.userId.AnhDaiDien}` : '/UnknownUser.jpg'} alt="avatar" />
                                </div>
                                <div className={styles.nameParent}>
                                    <div className={styles.name}>{review.userId?.TenTaiKhoan || 'Người dùng ẩn danh'}</div>
                                        <div className={styles.frameParent}>
                                            <div className={styles.rate} style={{gap: '5px'}}>
                                                {renderStars(review.SoDiem)}
                                            </div>
                                        <div className={styles.date}>
                                            {format(parseDateString(review.NgayViet), 'dd/MM/yyyy')}
                                        </div>
                                    </div>
                                    <div className={styles.text}>{review.NoiDung}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Sach;
