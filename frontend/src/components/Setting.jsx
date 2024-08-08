import { memo, useState } from "react";
import PropTypes from "prop-types";
import styles from "./Setting.module.css";

const Setting = memo(({ className = "", onToggleCheckboxColumn }) => {
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);

  const handleToggleCheckboxColumn = () => {
    setShowCheckboxColumn(prevState => !prevState);
    if (onToggleCheckboxColumn) {
      onToggleCheckboxColumn(!showCheckboxColumn); // Gọi callback để thông báo việc hiển thị checkbox thay đổi
    }
  };

  return (
    <div className={[styles.setting, className].join(" ")}>
      <div className={styles.options}>
        <select className={styles.filter} >
          <option value="Thể loại">Thể loại</option>
          <option value="Ngôn ngữ">Ngôn ngữ</option>
        </select>
      </div>
      <div className={styles.options}>
        <select className={styles.sort}>
          <option value="">Sắp xếp</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Mới nhất - Cũ nhất">Mới nhất - Cũ nhất</option>
          <option value="Cũ nhất - Mới nhất">Cũ nhất - Mới nhất</option>
        </select>
      </div>
      <div className={styles.SelectButton}>
        <div className={styles.chon} onClick={handleToggleCheckboxColumn}>Chọn</div>
      </div>
    </div>
  );
});

Setting.propTypes = {
  className: PropTypes.string,
  onToggleCheckboxColumn: PropTypes.func, // Callback khi thay đổi trạng thái hiển thị checkbox
};

export default Setting;
