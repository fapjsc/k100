import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { BsFillPlusCircleFill } from "react-icons/bs";

import { useDispatch, useSelector } from "react-redux";

import { Toast } from "antd-mobile";

import closeImg from "../../../Assets/blue_close_btn.png";

// Actions
import {
  setAcc,
  getAcc,
  getAccHistory,
} from "../../../store/actions/accountAction";

// Types
import { accountActionsTypes } from "../../../store/type";

// Components
import AccList from "./AccList";

import styles from "./EditBankInfoForm.module.scss";

const EditBankInfoForm = ({ accHistoryData, show, onHide }) => {
  const [showForm, setShowForm] = useState(false);
  const [clearItem, setClearItem] = useState(false);

  const dispatch = useDispatch();
  const {
    loading: setAccLoading,
    data: setAccData,
    error: setAccError,
  } = useSelector((state) => state.setAccount);


  const selectAccHandler = (acc) => {
    const newData = {
      P1: acc.P1,
      P2: acc.P2,
      P3: acc.P3,
      P4: acc.P4,
    };

    dispatch(setAcc(newData));
  };

  useEffect(() => {
    if (setAccLoading) {
      Toast.show({
        icon: "loading",
        content: "加载中…",
      });
    }
  }, [setAccLoading]);

  useEffect(() => {
    if (!setAccError && !setAccData) return;

    Toast.config({ duration: 1000 });

    if (setAccError) {
      Toast.show({
        icon: "fail",
        content: setAccError,
      });
    }

    if (setAccData) {
      Toast.show({
        icon: "success",
        content: "保存成功",
        afterClose: () => {
          dispatch(getAcc());
          dispatch(getAccHistory());
        },
      });
    }

    dispatch({ type: accountActionsTypes.SET_CURRENT_ACC_CLEAR });

    onHide();
    // eslint-disable-next-line
  }, [setAccData, setAccError, dispatch]);

  const onHideHandler = () => {
    setShowForm(false);
    onHide();
  };

  const addNewHandler = ({ target }) => {
    console.log(target.id);
    setShowForm(true);
    setClearItem(true);
  };

  return (
    <Modal show={show} onHide={onHideHandler} centered>
      <Modal.Header className={styles.header}>
        <h4 data-show={showForm && "show-form"} className={styles.title}>
          修改帳戶資料
        </h4>
        <div data-show={showForm && "show-form"} className={styles.close}>
          <img
            style={{ width: "2rem" }}
            src={closeImg}
            alt="close"
            onClick={onHideHandler}
          />
        </div>
      </Modal.Header>

      <Modal.Body style={{ border: "none", padding: 0 }}>
        {accHistoryData && (
          <AccList
            accHistoryData={accHistoryData}
            showForm={showForm}
            setShowForm={setShowForm}
            selectAccHandler={selectAccHandler}
            onHideHandler={onHideHandler}
            setClearItem={setClearItem}
            clearItem={clearItem}
          />
        )}
      </Modal.Body>

      {!showForm && (
        <Modal.Footer className={styles.footer} style={{ border: "none" }}>
          <Button
            id="new"
            className="easy-btn"
            onClick={addNewHandler}
            style={{
              width: "50%",
              margin: 0,
              padding: 10,
              fontSize: "1.4rem",
              backgroundColor: "white",
              color: "#3e80f9",
              border: "1px solid #3e80f9",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <BsFillPlusCircleFill style={{ fontSize: "1.4rem" }} />
              新增收款人
            </div>
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default EditBankInfoForm;
