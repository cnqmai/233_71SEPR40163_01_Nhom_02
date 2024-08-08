import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { format } from "date-fns"; 
import TopNavCom from "../components/TopNavComFocus";
import Footer from "../components/Footer";
import styles from "./GroupThaoLuan.module.css";

const GroupThaoLuan = () => {
  const [isLeftExpanded, setLeftExpanded] = useState(true);
  const toggleLeftWidth = () => {
    setLeftExpanded((prev) => !prev);
  };
  const navigate = useNavigate();
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const { groupName, userId  } = useParams(); 
  const [posts, setPosts] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [managedGroups, setManagedGroups] = useState([null]);
  const [participatedGroups, setParticipatedGroups] = useState([null]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [newPostContent, setNewPostContent] = useState(""); // State để lưu nội dung bài đăng mới
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState("");

  // Fetch dữ liệu cho nhóm cụ thể
  const fetchGroupData = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`http://localhost:3000/api/groups/getgroupwithposts/${userId}/${groupName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroupData(response.data);
      setPosts(response.data.BaiDang); 
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
      setManagedGroups(response.data);
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
      setParticipatedGroups(response.data);
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

  const onFrameButtonClick = useCallback(() => {
    // Please sync "Searching" to the project
  }, []);

  const onFrameButton1Click = useCallback(() => {
    navigate(`/accountthuvien/${userId}/${groupName}`);
  }, [navigate]);

  const onFrameButton2Click = useCallback(() => {
    navigate(`/groupsuggest/${userId}`);
  }, [navigate]);

  const onMoreButtonClick = useCallback(() => {
    navigate(`/groupyourgroupadmin/${userId}`);
  }, [navigate]);

  const onItemClick = useCallback((managedGroup) => {
    navigate(`/groupthaoluan/${userId}/${managedGroup.TenNhom}`);
  }, [navigate]);

  const onItem1Click = useCallback((participatedGroup) => {
    navigate(`/groupthaoluan/${userId}/${participatedGroup.TenNhom}`);

  }, [navigate]);

  const onMoreButton1Click = useCallback(() => {
    navigate(`/groupyourgroup/${userId}`);
  }, [navigate]);

  const onButtonClick = useCallback(() => {
    navigate(`/groupthanhvien/${userId}/${groupName}`);
  }, [navigate]);

  const onItemClickGroup = useCallback(() => {
    navigate(`/groupcreate/${userId}`);
  }, [navigate]);

  const handleJoinGroup = async () => {
    const token = localStorage.getItem('token');
    if (!token || !groupData?._id) return;
  
    try {
      await axios.post('http://localhost:3000/api/groups/join', 
        { groupId: groupData._id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Cập nhật trạng thái tham gia nhóm
      setIsJoined(true);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!newPostContent.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/api/posts/addpost', {
        tenTopic: newPostContent,
        groupId: groupData._id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts([response.data, ...posts]);
      setNewPostContent("");
      window.location.reload();
    } catch (error) {
      console.error('Error creating post:', {
        message: error.message,
        response: error.response ? error.response.data : 'No response',
        status: error.response ? error.response.status : 'No status',
        config: error.config
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePostSubmit(e);
    }
  };

  // Khi người dùng nhấp vào nút bình luận
  const handleCommentClick = (postId) => {
    setSelectedPostId(postId);
  };

  // Khi người dùng gửi bình luận
  const handleCommentSubmit = async (postId) => {
    if (!newCommentContent.trim() || !postId) return;
  
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(`http://localhost:3000/api/comments/addcomment`, {
        postId: postId,
        NoiDung: newCommentContent
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
   
      // Cập nhật danh sách bình luận của bài đăng
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
              ...post,
              BinhLuan: [...post.BinhLuan, response.data]
          };
        }
        return post;
      }));

      // Tải lại trang sau khi gửi bình luận thành công
      window.location.reload();

      // Reset nội dung bình luận
      setNewCommentContent("");
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const isUserInGroup = (groupId) => {
    return userData?.NhomThamGia.includes(groupId);
  };

  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (userData && groupData) {
      setIsJoined(isUserInGroup(groupData._id));
    }
  }, [userData, groupData]);

  return (
    <div className={styles.groupthaoluan}>
      <TopNavCom />
      <div className={styles.body}>
      <button className={styles.show} onClick={togglePanel}>
        <img
          className={`${styles.hideChild} ${isPanelVisible ? styles.imageRotate : ''}`}
          alt=""
          src="/rectangle-23@2x.png"
        />
      </button>
          <div className={`${styles.panel} ${isLeftExpanded ? styles.expanded : styles.collapsed}`}>
            <button className={styles.toggleButton} onClick={toggleLeftWidth}>
            {isLeftExpanded ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          <div className={styles.button}>
            <div className={styles.nhm}>{`Nhóm `}</div>
            <button className={styles.hide} onClick={onFrameButton2Click}>
              {`Khám Phá`}
              </button>
          </div>
          <button className={styles.toNhm} onClick={onItemClickGroup}>
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
          <div className={styles.cover} />
          <div className={styles.profile}>
            <div className={styles.status}>
              <img
                className={styles.statusChild}
                alt=""
                src={`/images/${groupData?.AnhDaiDien || 'default-image.png'}`}
              />
              <div className={styles.section}>
                <div className={styles.button2}>
                  <div className={styles.title2}>Thảo luận</div>
                </div>
                <button className={styles.button3} onClick={onButtonClick}>
                  <div className={styles.title2}>Mọi người</div>
                </button>
              </div>
            </div>
            <div className={styles.infoParent}>
              <div className={styles.info6}>
                <div className={styles.tnNhmParent}>
                  <div className={styles.nhm}>{groupData?.TenNhom}</div>
                  <div className={styles.div}>{groupData?.NgayTao ? format(new Date(groupData.NgayTao), 'dd/MM/yyyy') : 'N/A'}</div>
                </div>
                <div className={styles.chngTiKhng}>
                  {groupData?.GioiThieu}
                </div>
              </div>
              <div className={styles.status1}>
                <button className={styles.button4} onClick={handleJoinGroup} disabled={isJoined}>
                  <span className={styles.title2}>
                    {isJoined ? "Đã tham gia" : "Tham gia"}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className={styles.forum}>
            <form className={styles.editor} onSubmit={handlePostSubmit}>
              <div className={styles.avatar}>
                <img className={styles.image16Icon} src={userData?.AnhDaiDien ? `/images/${userData?.AnhDaiDien}` : '/UnknownUser.jpg'} alt="avatar" />
              </div>
              <input className={styles.editorChild} 
                placeholder="Nhập nội dung bài viết" 
                type="text" 
                value={newPostContent} 
                onChange={(e) => setNewPostContent(e.target.value)} 
                onKeyDown={handleKeyPress} />
            </form>

            {posts.map((post) => (
              <div key={post._id} className={styles.card}>
                <div className={styles.content}>
                  <div className={styles.status2}>
                    <div className={styles.avatar1}>
                      <img className={styles.image16Icon} alt="" src={post.userId?.AnhDaiDien ? `/images/${post.userId?.AnhDaiDien}` : '/UnknownUser.jpg'} />
                    </div>
                    <div className={styles.info7}>
                      <div className={styles.accountName}>
                        {post.userId?.TenTaiKhoan}
                      </div>
                      <div className={styles.div1}>{post?.ThoiGian ? format(new Date(post.ThoiGian), 'dd/MM/yyyy') : 'N/A'}</div>
                    </div>
                  </div>
                  <div className={styles.textbox}>
                    <div className={styles.liKhongT}>{post?.TenTopic}</div>
                  </div>
                </div>
                {<div className={styles.discussion}>
                  {post.BinhLuan && post.BinhLuan.map((comment, commentIndex) => (
                    <div key={commentIndex} className={styles.frame}>
                      <div className={styles.avatar2}>
                        <img className={styles.image16Icon} alt="" src={comment.userId?.AnhDaiDien ? `/images/${comment.userId?.AnhDaiDien}` : '/UnknownUser.jpg'} />
                      </div>
                      <div className={styles.textbox1}>
                        <div className={styles.bubble}>
                          <div className={styles.gg}>{comment.NoiDung}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>}
                <div className={styles.loadMore}>
                  <button className={styles.load}>
                    <img className={styles.image14Icon} alt="" src="/Down-Arrow.png" />
                  </button>
                </div>
                <form className={styles.editor1} onSubmit={(e) => {
                    e.preventDefault();
                    handleCommentSubmit(post._id); 
                  }}>
                  <div className={styles.avatar}>
                    <img className={styles.image16Icon} src={userData?.AnhDaiDien ? `/images/${userData.AnhDaiDien}` : '/UnknownUser.jpg'} alt="avatar" />
                  </div>
                  <input className={styles.input} 
                    type="text" 
                    placeholder="Viết bình luận..." 
                    value={newCommentContent} 
                    onChange={(e) => setNewCommentContent(e.target.value)} 
                    onFocus={() => setSelectedPostId(post._id)} 
                    onBlur={() => setSelectedPostId(null)} 
                  />
                  <button type="submit" className={styles.send}>
                    <img className={styles.promptSuggestionIcon} alt="" src="/prompt-suggestion.svg" />
                  </button>
                </form>
              </div>
            ))}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default GroupThaoLuan;
