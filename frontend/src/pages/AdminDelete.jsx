import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Setting from "../components/Setting";
import Footer from "../components/Footer";
import styles from "./AdminDelete.module.css";

const XaGnY = () => {
  return (
    <div className={styles.admindaxoaganday}>
      <TopNavMana />
      <section className={styles.container}>
        <PanelDefault />
        <section className={styles.container1}>
          <div className={styles.xaGnYParent}>
            <div className={styles.xaGnY}>Đã xóa gần đây</div>
            <div className={styles.searching}>
              <textarea className={styles.textbox} placeholder="[text]" />
              <div className={styles.search}>
                <img
                  className={styles.searchIcon}
                  alt="" src="/search1.svg"
                />
              </div>
            </div>
          </div>
          <Setting />
        </section>
      </section>
      <Footer />
    </div>
  );
};

export default XaGnY;
