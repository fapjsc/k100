import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { BsFillPersonCheckFill } from "react-icons/bs";

// Components
import AccForm from "./AccForm";

import styles from "./AccList.module.scss";

const AccList = ({
  accHistoryData,
  showForm,
  selectAccHandler,
  setShowForm,
  onHideHandler,
  clearItem,
  setClearItem,
}) => {
  //   const { data: currentAccData } = useSelector((state) => state.currentAcc);
  const { data: historyAccData } = useSelector((state) => state.historyAcc);

  const [currentItem, setCurrentItem] = useState(null);

  const onClickHandler = (id, type) => {
    const current = historyAccData.find((acc) => acc.H_id === id);
    setCurrentItem(current);
    selectAccHandler(current);
  };

  const editClick = (e, id) => {
    e.stopPropagation();
    const current = historyAccData.find((acc) => acc.H_id === id);
    setCurrentItem(current);
    setShowForm(true);
  };

  useEffect(() => {
    if (clearItem) {
      setCurrentItem(null);
      setClearItem(false);
    }
  }, [clearItem]);

  if (showForm) {
    return (
      <AccForm
        editData={currentItem}
        setShowForm={setShowForm}
        onHideHandler={onHideHandler}
      />
    );
  }

  return (
    <>
      <div className={styles["header-box"]}>
        <div />
        <div>收款姓名</div>
        <div>收款帳號</div>
        <div>開戶銀行</div>
        <div>所在省市</div>
        <div />
      </div>
      <div
        style={{
          maxHeight: "calc(50vh)",
          overflowY: "auto",
        }}
      >
        {accHistoryData?.map((d) => (
          <div key={d.H_id} className={styles["content-item"]}>
            <div className={styles["icon-box"]}>
              <BsFillPersonCheckFill />
            </div>
            <div onClick={() => onClickHandler(d.H_id)}>{d.P2}</div>
            <div onClick={() => onClickHandler(d.H_id)}>{d.P1}</div>
            <div onClick={() => onClickHandler(d.H_id)}>{d.P3}</div>
            <div onClick={() => onClickHandler(d.H_id)}>{d.P4}</div>
            <div style={{ zIndex: 10 }} onClick={(e) => editClick(e, d.H_id)}>
              ...
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AccList;
