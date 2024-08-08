import { memo } from "react";
import PropTypes from "prop-types";
import styles from "./Property1Default12.module.css";

const Property1Default12 = memo(({ className = "" }) => {
  return (
    <div className={[styles.property1default, className].join(" ")}>
      <div className={styles.schAWrapper}>
        <div className={styles.schA}>Sách A</div>
      </div>
      <div className={styles.schAWrapper}>
        <div className={styles.schB}>Sách B</div>
      </div>
      <div className={styles.schAWrapper}>
        <div className={styles.schB}>Sách C</div>
      </div>
      <div className={styles.schAWrapper}>
        <div className={styles.schB}>Sách D</div>
      </div>
    </div>
  );
});

Property1Default12.propTypes = {
  className: PropTypes.string,
};

export default Property1Default12;
