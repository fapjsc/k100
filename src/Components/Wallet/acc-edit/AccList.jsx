import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { BsFillPersonCheckFill } from "react-icons/bs";

// Hooks
import useRwd from "../../../hooks/useRwd";
// Lang Context
import { useI18n } from "../../../lang";

// Components
import AccForm from "./AccForm";
import AccListMobile from "./AccListMobile";

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

  const { isMobile } = useRwd();

  const { t } = useI18n();

  const onClickHandler = (id, type) => {
    const current = historyAccData.find((acc) => acc.H_id === id);
    setCurrentItem(current);
    selectAccHandler(current);
  };

  // const editClick = (e, id) => {
  //   e.stopPropagation();
  //   const current = historyAccData.find((acc) => acc.H_id === id);
  //   setCurrentItem(current);
  //   setShowForm(true);
  // };

  useEffect(() => {
    if (clearItem) {
      setCurrentItem(null);
      setClearItem(false);
    }
    // eslint-disable-next-line
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

  if (isMobile) {
    return (
      <AccListMobile
        accHistoryData={accHistoryData}
        onClickHandler={onClickHandler}
      />
    );
  }

  return (
    <>
      <div className={styles["header-box"]}>
        <div />
        <div>{t("EditBankInfoForm_name")}</div>
        <div>{t("EditBankInfoForm_account")}</div>
        <div>{t("EditBankInfoForm_bank")}</div>
        {process.env.REACT_APP_HOST_NAME === "K100U" && (
          <div>{t("EditBankInfoForm_city")}</div>
        )}
        <div />
      </div>
      <div
        style={{
          maxHeight: "calc(50vh)",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        {accHistoryData?.map((d) => (
          <div
            onClick={() => onClickHandler(d.H_id)}
            key={d.H_id}
            className={styles["content-item"]}
          >
            <div className={styles["icon-box"]}>
              <BsFillPersonCheckFill />
            </div>
            <div>{d.P2}</div>
            <div>{d.P1}</div>
            <div>{d.P3}</div>
            {process.env.REACT_APP_HOST_NAME === "K100U" && <div>{d.P4}</div>}
            {/* <div style={{ zIndex: 10 }} onClick={(e) => editClick(e, d.H_id)}>
              ...
            </div> */}
          </div>
        ))}
      </div>
    </>
  );
};

export default AccList;
