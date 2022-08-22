import React, { useState, useEffect, useRef } from "react";

import { ImageUploader, Toast } from "antd-mobile";

import { UploadOutline } from 'antd-mobile-icons'
import styles from "./KycValidForm.module.scss";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

const KycValidForm = () => {
  const [validated, setValidated] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    validCode: "",
    birthday: "",
    country: "",
    idNumber: "",
    idType: "",
    city: "",
    area: "",
    address: "",
    idLocation: "",
    idDate: "",
    accountName: "",
    accountCode: "",
    account: "",
  });

  const [firstList, setFirstList] = useState([]);
  const [secondList, setSecondList] = useState([]);
  const [selfList, setSelfList] = useState([]);
  const [accountList, setAccountList] = useState([]);

  const formBtnRef = useRef();
  const datePickerRef = useRef();

  // useEffect(() => {
  //   console.log(secondList, "secondList");
  //   console.log(firstList, "firstList");
  //   console.log(selfList, "self");
  // }, [firstList, secondList, selfList]);

  const mockUpload = async (file) => {
    await sleep(1000);
    return {
      url: URL.createObjectURL(file),
    };
  };

  const beforeUpload = (file) => {
    if (file.size > 1024 * 1024) {
      Toast.show("圖片尺寸超過1M");
      return null;
    }
    return file;
  };

  const sleep = (timer) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timer);
    });

  const onSubmit = async (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else if (
      firstList.length !== 2 ||
      secondList.length !== 2 ||
      selfList.length !== 1 ||
      accountList.length !== 1
    ) {
      Toast.show("image fail");
    } else {
      Toast.show({
        icon: <UploadOutline />,
        content: "上傳中…",
      });
      console.log(formData);
    }

    setValidated(true);
  };

  const getValidCode = async () => {
    if (isLoading) return;
    setLoading(true);
    await sleep(3000);
    setLoading(false);
    setFormData((prev) => ({
      ...prev,
      validCode: "1234",
    }));
  };

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    console.log(datePickerRef.current.setDateFormatter);
  }, [datePickerRef]);
  return (
    <>
      <Card className={styles.container}>
        <div className={styles.header}>實名驗證-基本資料</div>
        <Form
          noValidate
          validated={validated}
          onSubmit={onSubmit}
          style={{ marginTop: "2rem" }}
        >
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>姓名</Form.Label>
            <Form.Control
              required
              placeholder="輸入真實姓名"
              className="form-select mb-4 pl-3"
              onChange={onChange}
              value={formData.name}
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>電子信箱</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="輸入電子信箱"
              className="form-select mb-4 pl-3"
              onChange={onChange}
              value={formData.email}
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="validCode">
            <Form.Label>電子信箱驗證碼</Form.Label>
            <div className={styles["email-valid"]}>
              <Form.Control
                required
                placeholder="輸入電子信箱驗證碼"
                className="form-select mb-4 pl-3"
                onChange={onChange}
                value={formData.validCode}
                autoComplete="off"
              />
              <Button
                onClick={getValidCode}
                disabled={isLoading}
                variant="primary"
                type="button"
              >
                {isLoading ? (
                  <div>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </div>
                ) : (
                  "獲取驗證碼"
                )}
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="birthday">
            <Form.Label>出生日期</Form.Label>
            <Form.Control
              ref={datePickerRef}
              required
              type="date"
              placeholder="選擇出生日期"
              className="form-date mb-4 pl-3"
              onChange={onChange}
              value={formData.birthday}
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>選擇國籍</Form.Label>
            <Form.Control
              required
              as="select"
              placeholder="選擇類別"
              className="form-select mb-4 pl-3"
              style={{ fontSize: "17px" }}
              onChange={onChange}
              value={formData.country}
              id="country"
            >
              <option>台灣</option>
              <option>中國</option>
              <option>日本</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="idNumber">
            <Form.Label>身份證字號</Form.Label>
            <Form.Control
              required
              placeholder="輸入身份證字號"
              className="form-select mb-4 pl-3"
              onChange={onChange}
              value={formData.idNumber}
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="idDate">
            <Form.Label>發證日期</Form.Label>
            <Form.Control
              required
              // type="date"
              placeholder="選擇發證日期"
              className="form-date mb-4 pl-3"
              onChange={onChange}
              value={formData.idDate}
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="idLocation">
            <Form.Label>發證地點</Form.Label>
            <Form.Control
              required
              placeholder="輸入發證地點"
              className="form-select mb-4 pl-3"
              onChange={onChange}
              value={formData.idLocation}
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>領補換類別</Form.Label>
            <Form.Control
              required
              as="select"
              placeholder="選擇類別"
              className="form-select mb-4 pl-3"
              style={{ fontSize: "17px" }}
              onChange={onChange}
              value={formData.idType}
              id="idType"
            >
              <option>初</option>
              <option>補</option>
              <option>換</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>戶籍地址</Form.Label>

            <div className={styles["address-row"]}>
              <Form.Control
                required
                placeholder="請輸入城市"
                className="form-select mb-4 pl-3"
                onChange={onChange}
                value={formData.city}
                id="city"
                autoComplete="off"
              />

              <Form.Control
                required
                placeholder="請輸入區域"
                className="form-select mb-4 pl-3"
                onChange={onChange}
                value={formData.area}
                id="area"
                autoComplete="off"
              />
            </div>

            <Form.Control
              required
              placeholder="請輸入地址"
              className="form-select mb-4 pl-3"
              onChange={onChange}
              value={formData.address}
              id="address"
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="accountName">
            <Form.Label>銀行戶名</Form.Label>
            <Form.Control
              required
              placeholder="輸入銀行戶名"
              className="form-select mb-4 pl-3"
              onChange={onChange}
              value={formData.accountName}
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="accountCode">
            <Form.Label>銀行代號</Form.Label>
            <Form.Control
              required
              placeholder="輸入銀行代號"
              className="form-select mb-4 pl-3"
              onChange={onChange}
              value={formData.accountCode}
              autoComplete="off"
              type="number"
              onWheel={(event) => {
                event.currentTarget.blur();
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="account">
            <Form.Label>銀行帳號</Form.Label>
            <Form.Control
              required
              placeholder="輸入銀行帳號"
              className="form-select mb-4 pl-3"
              onChange={onChange}
              value={formData.account}
              autoComplete="off"
              type="number"
              onWheel={(event) => {
                event.currentTarget.blur();
              }}
            />
          </Form.Group>

          <Form.Text muted>
            請務必確保您所輸入的資料，與您的身份文件一致
          </Form.Text>

          <button ref={formBtnRef} style={{ display: "none" }}></button>
        </Form>
      </Card>

      <Card className={styles.container} style={{ marginTop: 0 }}>
        <div style={{ marginBottom: "1rem" }} className={styles.header}>
          實名驗證-上傳圖片
        </div>
        <Form.Text muted>*避免模糊</Form.Text>
        <Form.Text muted>*請勿使用經過編輯的圖片</Form.Text>
        <Form.Text muted>*檔案大小需在1MB內</Form.Text>
        {/* <Form.Text muted>*僅接受 .JPEG / .JPG / .PNG格式</Form.Text> */}

        <div style={{ marginTop: "1rem", fontSize: "18px" }}>
          <div>
            <span>上傳身分證 正 & 反面</span>
            <ImageUploader
              style={{ "--cell-size": "140px" }}
              value={firstList}
              onChange={setFirstList}
              upload={mockUpload}
              maxCount={2}
              showUpload={firstList.length < 2}
              beforeUpload={beforeUpload}
              showFailed={false}
            />
          </div>

          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>上傳第二證件 正 & 反面</span>
              <span style={{ fontSize: "1rem", color: "#CFCFD1" }}>
                健保卡/駕照/護照 擇一
              </span>
            </div>
            <ImageUploader
              style={{ "--cell-size": "140px" }}
              value={secondList}
              onChange={setSecondList}
              upload={mockUpload}
              maxCount={2}
              showFailed={false}
              showUpload={secondList.length < 2}
              beforeUpload={beforeUpload}
            />
          </div>

          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>上傳手持證件自拍照</span>
              <span style={{ fontSize: "1rem", color: "#CFCFD1" }}>
                身分證件請勿遮住臉部
              </span>
              <span style={{ fontSize: "1rem", color: "#CFCFD1" }}>
                手指請勿遮住證件文字
              </span>
            </div>
            <ImageUploader
              style={{ "--cell-size": "140px" }}
              value={selfList}
              onChange={setSelfList}
              upload={mockUpload}
              maxCount={1}
              showFailed={false}
              showUpload={selfList.length < 1}
              beforeUpload={beforeUpload}
            />
          </div>

          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>上傳存摺正面</span>
            </div>
            <ImageUploader
              style={{ "--cell-size": "140px" }}
              value={accountList}
              onChange={setAccountList}
              upload={mockUpload}
              maxCount={1}
              showFailed={false}
              showUpload={accountList.length < 1}
              beforeUpload={beforeUpload}
            />
          </div>
        </div>
        <Button
          variant="primary"
          type="button"
          style={{ height: "5rem", marginTop: "3rem", fontSize: "2rem" }}
          onClick={() => {
            formBtnRef.current.click();
          }}
        >
          填寫完成
        </Button>
      </Card>
    </>
  );
};

export default KycValidForm;
