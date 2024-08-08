import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { format } from "date-fns"; 
import TopNavCom from "../components/TopNavComFocus";
import Footer from "../components/Footer";
import styles from "./Group.module.css";

const Group = () => {
  const [isLeftExpanded, setLeftExpanded] = useState(true);
  const toggleLeftWidth = () => {
    setLeftExpanded((prev) => !prev);
  };
  const navigate = useNavigate();
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const { groupName, userId } = useParams(); 
  const [posts, setPosts] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [managedGroups, setManagedGroups] = useState([]);
  const [participatedGroups, setParticipatedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [userData, setUserData] = useState(null);

  // Fetch post comment
  const handleCommentSubmit = async (postId) => {
    const token = localStorage.getItem('token');
    
    if (!commentContent.trim()) {
      alert('Bình luận không thể rỗng');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/api/comments/addcommentinpost/${userId}/${postId}`, {
        NoiDung: commentContent,
        headers: {Authorization: `Bearer ${token}`}
      });
      setCommentContent('');
      fetchGroupData();
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
    }
  };

  // Fetch dữ liệu bài đăng của nhiều nhóm
  const fetchGroupData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get(`http://localhost:3000/api/groups/getgroupswithposts/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched group data:', response.data); // Log dữ liệu trả về
      setGroupData(response.data); // Gán dữ liệu nhóm
      
      // Combine posts from all groups
      const allPosts = response.data.flatMap(group => group.BaiDang || []);
      setPosts(allPosts);
    } catch (error) {
      console.error("Failed to fetch group data", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch nhóm do người dùng quản lý
  const fetchManagedGroups = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`http://localhost:3000/api/groups/getmanagegroups/${userId}/${groupName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setManagedGroups(response.data || []); // Đảm bảo managedGroups là mảng
    } catch (error) {
      console.error("Failed to fetch managed groups", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch nhóm mà người dùng tham gia
  const fetchParticipatedGroups = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`http://localhost:3000/api/groups/getjoinedgroups/${userId}/${groupName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParticipatedGroups(response.data || []); // Đảm bảo participatedGroups là mảng
    } catch (error) {
      console.error("Failed to fetch participated groups", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dữ liệu người dùng đang đăng nhập
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

useEffect(() => {
    fetchGroupData();
    fetchManagedGroups();
    fetchParticipatedGroups();
    fetchUserData();
  }, [groupName, userId]);

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFrameButton2Click = useCallback(() => {
    navigate(`/groupsuggest/${userId}`);
  }, [navigate, userId]);

  const onMoreButtonClick = useCallback(() => {
    navigate(`/groupyourgroupadmin/${userId}`);
  }, [navigate, userId]);

  const onItemClick = useCallback((managedGroup) => {
    navigate(`/groupthaoluan/${userId}/${managedGroup.TenNhom}`);
  }, [navigate, userId]);

  const onItem1Click = useCallback((participatedGroup) => {
    navigate(`/groupthaoluan/${userId}/${participatedGroup.TenNhom}`);
  }, [navigate, userId]);

  const onItem2Click = useCallback(() => {
    navigate(`/groupthaoluan/${userId}/${groupName}`);
  }, [navigate, userId, groupName]);

  const onMoreButton1Click = useCallback(() => {
    navigate(`/groupyourgroup/${userId}`);
  }, [navigate, userId]);

  const onItemClickGroup = useCallback(() => {
    navigate(`/groupcreate/${userId}`);
  }, [navigate, userId]);

  return (
    <div className={styles.group}>
      <TopNavCom />
      <div className={styles.body}>
      <div className={`${styles.panel} ${isLeftExpanded ? styles.expanded : styles.collapsed}`}>
          <button className={styles.toggleButton} onClick={toggleLeftWidth}>
          {isLeftExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <div className={styles.button}>
            <div className={styles.nhm}>{`Nhóm `}</div>    
            <button className={styles.hide} onClick={onFrameButton2Click}>
              {`Khám phá`}
            </button>
          </div>
          <button className={styles.toNhm} onClick={onItemClickGroup} >
            <div className={styles.button1}>
              <div className={styles.title}>Tạo nhóm mới</div>
            </div>
          </button>
          <form className={styles.tmKim}>
            <div className={styles.tmNhm}>Tìm nhóm</div>
            <input className={styles.tmKimChild} type="text" />
          </form>
          <div className={styles.nhm1}>
            <div className={styles.heading}>
              <div className={styles.nhmDoBn}>Nhóm do bạn quản lí</div>
              <button className={styles.moreButton} onClick={onMoreButtonClick}>
                <img className={styles.image23Icon} alt="" src="/RightUpArrow.png" />
              </button>
            </div>
            <div className={styles.list}>
              {managedGroups.slice(0, 3).map((managedGroup, index) => (
                <button key={index} className={styles.item} onClick={() => onItemClick(managedGroup)}>
                  <div className={styles.imageCon}>
                    <img className={styles.image20} src={`/images/${managedGroup?.AnhDaiDien}`}alt={managedGroup?.TenNhom} />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.tnNhm}>{managedGroup?.TenNhom}</div>
                    {/* <div className={styles.giiThiu}>{managedGroup?.GioiThieu}</div> */}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.nhm1}>
            <div className={styles.heading}>
              <div className={styles.nhmDoBn}>Nhóm bạn tham gia</div>
              <button className={styles.moreButton} onClick={onMoreButton1Click}>
                <img className={styles.image23Icon} alt="" src="/RightUpArrow.png" />
              </button>
            </div>
            <div className={styles.list}>
              {participatedGroups.slice(0, 3).map((participatedGroup, index) => (
                <button key={index} className={styles.item} onClick={() => onItem1Click(participatedGroup)}>
                  <div className={styles.imageCon}>
                    <img className={styles.image20} src={`/images/${participatedGroup?.AnhDaiDien}`}alt={participatedGroup?.TenNhom} />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.tnNhm}>{participatedGroup?.TenNhom}</div>
                    {/* <div className={styles.giiThiu}>{participatedGroup?.GioiThieu}</div> */}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.nhm}>{`Hoạt động nhóm mới nhất`}</div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {posts.length === 0 ? (
                <div>Không có bài đăng nào</div>
              ) : (
                posts.map((post, index) => (
                  <div key={index} className={styles.card}>
                    <div className={styles.content}>
                      <div className={styles.status}>
                        <div className={styles.avatar}>
                          <img className={styles.image16Icon} alt="" src={post.userId?.AnhDaiDien ? `/images/${post.userId?.AnhDaiDien}` : '/UnknownUser.jpg'} />
                        </div>
                        <div className={styles.info6}>
                          <div className={styles.Name}>
                            {post.userId.TenTaiKhoan}
                          </div>
                          <div className={styles.div}>{post?.ThoiGian ? format(new Date(post.ThoiGian), 'dd/MM/yyyy') : 'N/A'}</div>
                        </div>
                      </div>
                      <div className={styles.textbox}>
                        <div className={styles.liKhngT}>{post?.TenTopic}</div>
                      </div>
                    </div>
                    {post.BinhLuan && post.BinhLuan.length > 0 && (
                      <div className={styles.discussion}>
                        {post.BinhLuan.map((comment, commentIndex) => (
                          <div key={commentIndex} className={styles.frame}>
                            <div className={styles.avatar1}>
                              <img className={styles.image16Icon} alt="" src={comment.userId?.AnhDaiDien ? `/images/${comment.userId?.AnhDaiDien}` : '/UnknownUser.jpg'} />
                            </div>
                            <div className={styles.textbox1}>
                              <div className={styles.bubble}>
                                <div className={styles.gg}>{comment.NoiDung}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={styles.loadMore}>
                      <button className={styles.load}>
                        <img className={styles.image14Icon} alt="" src="/Down-Arrow.png" />
                      </button>
                    </div>
                    <form className={styles.editor}>
                      <div className={styles.avatar4}>
                        <img className={styles.image16Icon} src={userData?.AnhDaiDien ? `/images/${userData?.AnhDaiDien}` : '/UnknownUser.jpg'} alt="avatar" />
                      </div>
                      <input
                        className={styles.input}
                        type="text"
                        placeholder="Viết bình luận..."
                        onChange={(e) => setCommentContent(e.target.value)}
                      />
                      <button
                        className={styles.send}
                        onClick={() => handleCommentSubmit(post._id)} 
                      >
                        <img className={styles.promptSuggestionIcon} alt="" src="/prompt-suggestion.svg" />
                      </button>
                    </form>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Group;
