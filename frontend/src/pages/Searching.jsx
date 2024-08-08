import { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate, Link } from "react-router-dom";
import TopNavDisc from "../components/TopNavDiscFocus";
import Footer from "../components/Footer";
import styles from "./Searching.module.css";

const SortingOptions = {
  ASCENDING: "A-Z",
  DESCENDING: "Z-A",
  NEWEST_TO_OLDEST: "Mới nhất - Cũ nhất",
  OLDEST_TO_NEWEST: "Cũ nhất - Mới nhất"
};

const Searching = () => {
  const [isLeftExpanded, setLeftExpanded] = useState(true);
  const toggleLeftWidth = () => {
    setLeftExpanded((prev) => !prev);
  };
  const navigate = useNavigate();
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState(null);

  // Fetch all books
  const fetchBooks = async () => {
    const token = localStorage.getItem('token');

    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/books/getallbooks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch books based on search query
  const fetchSearchedBooks = async (query) => {
    const token = localStorage.getItem('token');

    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/books/searchbooks', {
        params: { query },
        headers: {Authorization: `Bearer ${token}`}
      });
      setBooks(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/genres/getallgenres', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data); // Assuming response is an array of objects
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch all books and categories initially
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  // Fetch searched books when search query changes
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      fetchSearchedBooks(searchQuery);
    } else {
      fetchBooks();
    }
  }, [searchQuery]);

  // Lọc sách dựa trên các thể loại đã chọn
  const filterBooksByCategories = (books, selectedCategories) => {
    if (selectedCategories.length === 0) return books;

    return books.filter(book => {
      const bookCategories = book.TheLoai;

      // Kiểm tra xem sách có ít nhất một thể loại trong danh sách thể loại đã chọn không
      const hasAtLeastOneCategory = selectedCategories.some(category => bookCategories.includes(category));

      // Kiểm tra nếu sách có tất cả các thể loại đã chọn
      const hasExactlySelectedCategories = selectedCategories.length === bookCategories.length &&
        selectedCategories.every(category => bookCategories.includes(category)) &&
        bookCategories.every(category => selectedCategories.includes(category));

      return hasAtLeastOneCategory || hasExactlySelectedCategories;
    });
  };

  // Lọc sách dựa trên các ngôn ngữ đã chọn
  const filterBooksByLanguages = (books, selectedLanguages) => {
    if (selectedLanguages.length === 0) return books;

    return books.filter(book => {
      return selectedLanguages.includes(book.NgonNgu);
    });
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return new Date(year, month - 1, day); // month - 1 vì tháng trong JavaScript bắt đầu từ 0
  };
  
  const calculateAverageRating = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
  
    const totalScore = reviews.reduce((sum, review) => sum + (review.SoDiem || 0), 0);
    return (totalScore / reviews.length).toFixed(1); // One decimal place
  };  

  // Sort books based on selected option
  const sortBooks = (books, option) => {
    switch (option) {
      case SortingOptions.ASCENDING:
        return [...books].sort((a, b) => a.TieuDe.localeCompare(b.TieuDe));
      case SortingOptions.DESCENDING:
        return [...books].sort((a, b) => b.TieuDe.localeCompare(a.TieuDe));
      case SortingOptions.NEWEST_TO_OLDEST:
        return [...books].sort((a, b) => parseDate(b.NgayXB) - parseDate(a.NgayXB));
      case SortingOptions.OLDEST_TO_NEWEST:
        return [...books].sort((a, b) => parseDate(a.NgayXB) - parseDate(b.NgayXB));
      default:
        return books;
    }
  };

  const handleSortChange = (option) => {
    setSortOption(prevOption => prevOption === option ? null : option);
  };

  const toggleCategoryDropdown = () => {
    setCategoryOpen(prev => !prev);
  };

  const toggleLanguageDropdown = () => {
    setLanguageOpen(prev => !prev);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prevSelected => 
      prevSelected.includes(category)
        ? prevSelected.filter(cat => cat !== category)
        : [...prevSelected, category]
    );
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguages(prevSelected => 
      prevSelected.includes(language)
        ? prevSelected.filter(lang => lang !== language)
        : [...prevSelected, language]
    );
  };

  const filteredBooks = filterBooksByLanguages(filterBooksByCategories(books, selectedCategories), selectedLanguages);
  const sortedBooks = sortBooks(filteredBooks, sortOption);

  return (
    <div className={styles.searching}>
      <TopNavDisc />
      <main className={styles.body}>
        <div className={`${styles.left} ${isLeftExpanded ? styles.expanded : styles.collapsed}`}>
          <button className={styles.toggleButton} onClick={toggleLeftWidth}>
            {isLeftExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <div className={styles.settingContainer}>
            <div className={styles.setting}>
              <div className={styles.heading}>
                <h4 className={styles.subheading}>Sắp xếp</h4>
              </div>
              <div className={styles.optionsContainer}>
                {Object.values(SortingOptions).map(option => (
                  <div className={styles.option} key={option}>
                    <input
                      type="checkbox"
                      name="sort"
                      checked={sortOption === option}
                      onChange={() => handleSortChange(option)}
                      className={styles.checkbox}
                    />
                    <div className={styles.sort}>{option}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.setting}>
              <div className={styles.heading}>
                <h4 className={styles.subheading}>Bộ lọc</h4>
              </div>
              <div className={styles.optionsContainer}>
                {/* Category Dropdown */}
                <div className={styles.dropdown} onClick={toggleCategoryDropdown}>
                  <img
                    className={`${styles.arrowDown} ${isCategoryOpen ? styles.open : ""}`}
                    alt="Toggle Category Dropdown"
                    src="/arrow-forward-ios@2x.png"
                  />
                  <h4 className={styles.subheading}>Thể loại</h4>
                </div>
                {isCategoryOpen && (
                  <div className={styles.options}>
                    {categories.map((category) => (
                      <div className={styles.option} key={category._id}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={selectedCategories.includes(category.TenTheLoai)}
                          onChange={() => handleCategoryChange(category.TenTheLoai)}
                        />
                        <div className={styles.category}>{category.TenTheLoai}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Language Dropdown */}
                <div className={styles.dropdown} onClick={toggleLanguageDropdown}>
                  <img
                    className={`${styles.arrowDown} ${isLanguageOpen ? styles.open : ""}`}
                    alt="Toggle Language Dropdown"
                    src="/arrow-forward-ios@2x.png"
                  />
                  <h4 className={styles.subheading}>Ngôn ngữ</h4>
                </div>
                {isLanguageOpen && (
                  <div className={styles.options}>
                    {["Tiếng Việt", "Tiếng Anh"].map(lang => (
                      <div className={styles.option} key={lang}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={selectedLanguages.includes(lang)}
                          onChange={() => handleLanguageChange(lang)}
                        />
                        <div className={styles.lang}>{lang}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.right}>
          <div className={styles.searchContainer}>
            <textarea
              className={styles.textbox}
              placeholder="Nhập ID / Tên sách / Tác giả của sách muốn tìm kiếm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className={styles.search}>
              <img className={styles.searchIcon} alt="Search" src="/search1.svg" />
            </div>
          </div>
          <section className={styles.container}>
            <div className={styles.items}>
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                sortedBooks.map((book, index) => (
                  <div className={styles.block} key={index}>
                    <Link to={`/sach/${book.TieuDe}`} className={styles.item}>
                      <div className={styles.title}>{book.TieuDe}</div>
                      <div className={styles.infoCon}>
                        <div className={styles.cover}>
                          <img
                            className={styles.img}
                            alt={book.TieuDe}
                            src={`/images/${book.AnhBia}`}
                          />
                        </div>
                        <div className={styles.info}>
                          <div className={styles.author}>
                            {book.TacGia && Array.isArray(book.TacGia) ? book.TacGia.map(author => author.HoTen).join(", ") : "Không có tác giả"}
                          </div>
                          <div className={styles.langrate}>
                            <div className={styles.language}>{book.NgonNgu}</div>
                            <div className={styles.rate}>{calculateAverageRating(book.DanhGia || [])}/5</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Searching;
