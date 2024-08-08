import React from "react";
import TopNavDisc from "../components/TopNavDiscFocus";
import Footer from "../components/Footer";
import styles from "./AboutUs.module.css";

const AboutUs = () => {
    return (
        <div className={styles.aboutUs}>
            <TopNavDisc />
            <section className={styles.body}>
                <h1 className={styles.heading}>Về chúng tôi</h1>
                <div className={styles.introduction}>
                    <p>
                        Chào mừng đến với Bookaboo!
                        Bookaboo không chỉ là một nơi để chia sẻ quan điểm về những cuốn sách mà còn là một cộng đồng nơi các độc giả có thể kết nối, trao đổi và cùng nhau khám phá những tri thức và trải nghiệm mới qua từng trang sách. Chúng tôi mong muốn tạo ra một nơi mà mọi người yêu sách có thể cùng nhau học hỏi và phát triển.
                    </p>
                    <br />

                    <h3>Sứ mệnh của chúng tôi</h3>
                    <p>
                        Sứ mệnh của chúng tôi là lan tỏa văn hóa đọc và kết nối cộng đồng yêu sách. Chúng tôi mong muốn tạo ra một không gian thân thiện và cởi mở, nơi mọi người có thể đắm mình vào thế giới của sách và kết nối với những tâm hồn đồng điệu.
                    </p>
                    <br />
                    
                    <h3>Giá trị cốt lõi</h3>
                    <p>
                        <ul>
                            <li><strong>Tình yêu sách:</strong> Chúng tôi đam mê sách và muốn truyền cảm hứng đọc sách đến mọi người.</li>
                            <li><strong>Cộng đồng:</strong> Bookaboo là nơi kết nối các độc giả, tạo điều kiện để họ chia sẻ những câu chuyện và ý tưởng.</li>
                            <li><strong>Sự đa dạng:</strong> Chúng tôi tự hào về bộ sưu tập sách phong phú và đa dạng, từ các tác phẩm văn học kinh điển đến những cuốn sách hiện đại.</li>
                            <li><strong>Học hỏi suốt đời:</strong> Chúng tôi khuyến khích việc học hỏi và phát triển không ngừng thông qua việc đọc sách.</li>
                        </ul>
                    </p>
                    <br />

                    <h3>Dịch vụ của chúng tôi</h3>
                    <p>
                        Nền tảng đánh giá sách: Một thư viện phong phú với hàng ngàn đầu sách đa dạng thể loại, cung cấp đánh giá chi tiết từ độc giả.<br />
                        Cộng đồng yêu sách: Nơi bạn có thể tham gia thảo luận, đánh giá sách và chia sẻ cảm nhận với những độc giả khác.<br />
                        Sự kiện và hoạt động: Các buổi giao lưu, tọa đàm và sự kiện đặc biệt dành cho những người yêu sách.
                    </p>
                    <br />

                    <h3>Hãy cùng chúng tôi lan tỏa văn hóa đọc</h3>
                    <p>
                        Tham gia cùng chúng tôi tại Bookaboo và trở thành một phần của cộng đồng yêu sách. Hãy cùng nhau khám phá, học hỏi và lan tỏa niềm đam mê đọc sách đến mọi người.
                    </p>
                    <br />
                    
                    <h3>Liên hệ với chúng tôi</h3>
                    <p>
                        Nếu bạn có bất kỳ câu hỏi hay góp ý nào, xin đừng ngần ngại liên hệ với chúng tôi qua email: <a href="mailto:support@bookaboo.com">support@bookaboo.com</a> hoặc qua số điện thoại: 123-456-789.
                    </p>
                    <p>
                        Cảm ơn bạn đã ghé thăm Bookaboo. Chúng tôi rất mong được đồng hành cùng bạn trên hành trình khám phá thế giới sách!
                    </p>
                </div>

                <div className={styles.members}>
                    <h1 className={styles.heading}>Đội ngũ Bookaboo</h1>
                    <div className={styles.member}>
                        <div className={styles.imgCon}>
                            <img src="/images/musachibi.jpg" alt="Quách Mỹ Tân" />
                        </div>
                        <div className={`${styles.infoCon} ${styles.infoRight}`}>
                            <h2>Quách Mỹ Tân</h2>
                            <p>UI/UX Designer</p>
                            <p>Front-end Developer</p>
                            <a href="mailto:b@mail.com">qmtan@mail.com</a>
                        </div>
                    </div>
                    <div className={`${styles.member} ${styles.flip}`}>
                        <div className={`${styles.infoCon} ${styles.infoLeft}`}>
                            <h2>Lưu Thúy Anh</h2>
                            <p>UI/UX Designer</p>
                            <p>Front-end Developer</p>
                            <a href="mailto:c@mail.com">ltanh@mail.com</a>
                        </div>
                        <div className={styles.imgCon}>
                            <img src="/images/stellachibi.jpg" alt=" Lưu Thúy Anh" />
                        </div>
                    </div>
                    <div className={styles.member}>
                        <div className={styles.imgCon}>
                            <img src="/images/florachibi.jpg" alt="Cao Ngọc Quỳnh Mai" />
                        </div>
                        <div className={`${styles.infoCon} ${styles.infoRight}`}>
                            <h2>Cao Ngọc Quỳnh Mai</h2>
                            <p>Back-end Developer</p>
                            <a href="mailto:a@mail.com">cnqmai@mail.com</a>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default AboutUs;
