import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useDispatch, useSelector } from "react-redux";

// Actions
import { setAcc } from "../../../store/actions/accountAction";

import { Toast } from "antd-mobile";

// // Helpers
import { _setAgentAccDataFormat } from "../../../lib/helper";

import styles from "./AccForm.module.scss";

const AccForm = ({ onHideHandler, setShowForm, editData }) => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    account: "",
    bank: "",
    city: "",
  });

  const dispatch = useDispatch();

  const {
    loading: setAccLoading,
    data: setAccData,
    error: setAccError,
  } = useSelector((state) => state.setAccount);

  const onChange = ({ target }) => {
    const { id } = target || {};
    if (!id) return;

    setFormData((prev) => ({
      ...prev,
      [id]: target.value,
    }));
  };

  useEffect(() => {
    const { name, account, bank } = formData || {};

    if (name && account && bank) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [formData]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(setAcc(_setAgentAccDataFormat(formData)));
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        account: editData.P1,
        name: editData.P2,
        bank: editData.P3,
        city: editData.P4,
      });
    }

    return () => {
      setFormData({
        name: "",
        account: "",
        bank: "",
        city: "",
      });
    };
  }, [editData]);

  useEffect(() => {
    if (setAccData) {
      Toast.config({ duration: 1000, position: "center" });
      Toast.show({
        icon: "success",
        content: "新增成功",
      });

      setShowForm(false);

      return;
    }

    if (setAccError) {
      Toast.show({
        icon: "fail",
        content: setAccError,
      });
    }
  }, [setAccData, setAccError, setShowForm]);

  return (
    <Form className={styles.form} onSubmit={onSubmitHandler}>
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>收款姓名</Form.Label>
        <Form.Label style={{ color: "red" }}>(必填)</Form.Label>
        <Form.Control
          className={styles["input"]}
          onChange={onChange}
          type="text"
          placeholder="請輸入收款姓名"
          value={formData.name}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="account">
        <Form.Label>收款帳號</Form.Label>
        <Form.Label style={{ color: "red" }}>(必填)</Form.Label>
        <Form.Control
          onChange={onChange}
          className={styles["input"]}
          type="text"
          placeholder="請輸入收款帳號"
          value={formData.account}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="bank">
        <Form.Label>開戶銀行</Form.Label>
        <Form.Label style={{ color: "red" }}>(必填)</Form.Label>
        <Form.Control
          onChange={onChange}
          className={styles["input"]}
          type="text"
          placeholder="請輸入開戶銀行"
          value={formData.bank}
        />
      </Form.Group>

      {process.env.REACT_APP_HOST_NAME === "K100U" && (
        <Form.Group className="mb-3" controlId="city">
          <Form.Label>所在省市</Form.Label>
          <Form.Control
            onChange={onChange}
            className={styles["input"]}
            type="text"
            placeholder="請輸入所在省市"
            value={formData.city}
          />
        </Form.Group>
      )}

      <div style={{ color: "red" }}>*需與匯款帳戶資訊一致</div>

      <div style={{ display: "flex", gap: "8%" }}>
        <Button
          onClick={() => setShowForm(false)}
          className="easy-btn-ghost"
          style={{ padding: 10 }}
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={!canSubmit || setAccLoading}
          className="easy-btn"
          style={{ padding: 10, backgroundColor: !canSubmit && "#808080" }}
        >
          新增
        </Button>
      </div>
    </Form>
  );
};

export default AccForm;
