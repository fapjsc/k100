import React from "react";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";

import styles from "./MemberLevelAlert.module.scss";

const MemberLevelAlert = ({ show, errorText, handleClose }) => {
  if (errorText === "買賣功能已被鎖定") {
    return (
      <>
        <Modal
          centered
          contentClassName={styles.container}
          show={show}
          onHide={handleClose}
        >
          <Modal.Header style={{ border: "none" }}>
            <div className={styles.header}>
              <span>系統訊息</span>
              <AiOutlineClose
                onClick={handleClose}
                className={styles["header-icon"]}
              />
            </div>
          </Modal.Header>

          <Modal.Body className={styles.body}>
            <h3 className={styles["body-title"]}>買賣功能已被鎖定</h3>
            <div className={styles["sub-text-box"]}>
              <p>鎖定原因： 累計超過 10 次/每 30 天超時訂單</p>
              <p>鎖定時間： 24 小時</p>
            </div>
          </Modal.Body>

          <Modal.Footer style={{ border: "none" }}>
            <button onClick={handleClose} className={styles.button}>
              關閉
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Modal
        contentClassName={styles.container}
        show={show}
        onHide={handleClose}
        centered

        
      >
        <Modal.Header style={{ border: "none" }}>
          <div className={styles.header}>
            <span>系統訊息</span>
            <AiOutlineClose
              onClick={handleClose}
              className={styles["header-icon"]}
            />
          </div>
        </Modal.Header>

        <Modal.Body className={styles.body}>
          <h3 className={styles["body-title"]}>交易額度不足</h3>
          <div className={styles["sub-text-box"]}>
            <p>你的交易額度已達上限</p>
            <p>欲提高交易額度請洽客服窗口申請</p>
          </div>
        </Modal.Body>

        <Modal.Footer style={{ border: "none" }}>
          <button onClick={handleClose} className={styles.button}>
            聯繫客服
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MemberLevelAlert;
