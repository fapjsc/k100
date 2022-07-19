import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { BsFillPersonCheckFill, BsFillTrashFill } from "react-icons/bs";

// Hooks
import useRwd from "../../../hooks/useRwd";
import useHttp from "../../../hooks/useHttp";

// Apis
import { delAgentAcc } from "../../../lib/api";

// Lang Context
import { useI18n } from "../../../lang";

// Components
import AccForm from "./AccForm";
import AccListMobile from "./AccListMobile";

import styles from "./AccList.module.scss";
import Button from "react-bootstrap/Button";

const AccList = ({
  accHistoryData,
  showForm,
  selectAccHandler,
  setShowForm,
  onHideHandler,
  clearItem,
  setClearItem,
  getAccHistory,
}) => {
  //   const { data: currentAccData } = useSelector((state) => state.currentAcc);
  const { data: historyAccData } = useSelector((state) => state.historyAcc);
  const { data: currentAccData } = useSelector((state) => state.currentAcc);

  const [currentItem, setCurrentItem] = useState(null);

  const dispatch = useDispatch();

  const { isMobile } = useRwd();

  const { t } = useI18n();

  const {
    sendRequest: delAcc,
    data: delAccData,
    status: delAccStatus,
    error: delAccError,
  } = useHttp(delAgentAcc);

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
    // console.log(delAccData);
    if (delAccStatus === "pending") return;

    if (delAccError) {
      alert(delAccError);
      return;
    }

    if (delAccData) {
      dispatch(getAccHistory());
    }
  }, [delAccStatus, delAccError, delAccData, dispatch]);

  useEffect(() => {
    if (clearItem) {
      setCurrentItem(null);
      setClearItem(false);
    }
    // eslint-disable-next-line
  }, [clearItem]);

  const deleteHandler = (id) => {
    delAcc(id);
  };

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
        getAccHistory={getAccHistory}
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
          overflowX: "scroll"
          // overflowX: "hidden",
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

            {currentAccData.P1 !== d.P1 && (
              <Button
                variant="primary"
                disabled={delAccStatus === "pending"}
                style={{ width: "3rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHandler(d.H_id);
                }}
              >
                {delAccStatus === "pending" ? (
                  <span style={{ fontSize: "5px", color: "white" }}>
                    loading...
                  </span>
                ) : (
                  <BsFillTrashFill
                    style={{
                      color: "white",
                      display: "inline-block",
                    }}
                  />
                )}
              </Button>
            )}

            {/* {process.env.REACT_APP_HOST_NAME === "88U" &&
              currentAccData.P1 !== d.P1 && (
                <Button
                  variant="primary"
                  disabled={delAccStatus === "pending"}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler(d.H_id);
                  }}
                >
                  {delAccStatus === "pending" ? (
                    <span style={{ fontSize: "5px", color: "white" }}>
                      loading...
                    </span>
                  ) : (
                    <BsFillTrashFill
                      style={{
                        color: "white",
                        display: "inline-block",
                      }}
                    />
                  )}
                </Button>
              )} */}

            {/* {process.env.REACT_APP_HOST_NAME === "K100U" &&
              currentAccData.P1 !== d.P1 && (
                <Button
                  variant="primary"
                  disabled={delAccStatus === "pending"}
                  style={{ width: "3rem" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler(d.H_id);
                  }}
                >
                  {delAccStatus === "pending" ? (
                    <span style={{ fontSize: "5px", color: "white" }}>
                      loading...
                    </span>
                  ) : (
                    <BsFillTrashFill
                      style={{
                        color: "white",
                        display: "inline-block",
                      }}
                    />
                  )}
                </Button>
              )} */}
          </div>
        ))}
      </div>
    </>
  );
};

export default AccList;
