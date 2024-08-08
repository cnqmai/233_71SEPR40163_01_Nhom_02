import TopNavMana from "../components/TopNavManaFocus";
import PanelDefault from "../components/PanelDefault";
import Footer from "../components/Footer";
import styles from "./Admin.module.css";

const Admin = () => {
  return (
    <div className={styles.admin}>
      <TopNavMana />
      <section className={styles.container}>
        <PanelDefault />
        <div className={styles.containerChild} />
      </section>
      <Footer />
    </div>
  );
};

export default Admin;
