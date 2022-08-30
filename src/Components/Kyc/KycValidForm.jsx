import React, { useState, useEffect, useRef } from "react";
import { Stepper, Step } from "react-form-stepper";

import {
  isNationalIdentificationNumberValid, // 身分證字號
} from "taiwan-id-validator";

import { useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { BsFillCaretDownFill } from "react-icons/bs";
import Accordion from "react-bootstrap/Accordion";

import { ImageUploader, Toast } from "antd-mobile";

import { UploadOutline } from "antd-mobile-icons";
import styles from "./KycValidForm.module.scss";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

import { resizeFile } from "../../lib/imageResize";

import { setKyc, cleanSetKycStatus } from "../../store/actions/kycAction";
import {
  setKycUserData,
  cleanKycSetUserStatus,
} from "../../store/actions/userAction";

const KycValidForm = () => {
  const history = useHistory();

  const [validated, setValidated] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [blurShowError, setBlurShowError] = useState({});

  const {
    isLoading: setKycLoading,
    error: setKycError,
    data: kycData,
  } = useSelector((state) => state.setKyc);

  const {
    loading: userKycLoading,
    error: userKycError,
    data: userKycData,
  } = useSelector((state) => state.setUser);

  const [userData, setUserData] = useState({
    country: "台灣",
    idType: "初",
    name: "",
    email: "",
    validCode: "",
    birthday: "",
    idNumber: "",
    city: "",
    area: "",
    address: "",
    idLocation: "",
    idDate: "",

    IDPhotoFront: "",
    IDPhotoBack: "",
    IDPhotoSecondFront: "",
    IDPhotoSecondBack: "",
    selfPhoto: "",
  });

  const [formData, setFormData] = useState({
    account: "",
    accountName: "",
    bankCode: "",

    accountNameSecond: "",
    bankCodeSecond: "",
    accountSecond: "",

    accountNameThird: "",
    bankCodeThird: "",
    accountThird: "",

    bankBook: "",
    bankBookSecond: "",
    bankBookThird: "",
  });

  const [firstList, setFirstList] = useState([]);
  const [secondList, setSecondList] = useState([]);
  const [selfList, setSelfList] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [accountListSecond, setAccountListSecond] = useState([]);
  const [accountListThird, setAccountListThird] = useState([]);

  const formBtnRef = useRef();
  const datePickerRef = useRef();
  const scrollRef = useRef();

  const dispatch = useDispatch();

  const scrollToRef = (ref) =>
    window.scrollTo({ top: ref.current.offsetTop, behavior: "smooth" });

  const mockUpload = async (file, type) => {
    const result = await resizeFile(file);
    if (type === "bankBook") {
      setFormData((prev) => ({
        ...prev,
        [type]: result,
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [type]: result,
      }));
    }

    await sleep(200);
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
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (!isNationalIdentificationNumberValid(userData.idNumber)) {
      setValidated(false);
      setBlurShowError((prev) => ({
        ...prev,
        idNumber: true,
      }));
      Toast.show({
        icon: "fail",
        content: "無效的身分證號碼",
      });
      scrollToRef(scrollRef);
      return;
    }

    if (form.checkValidity() === false) {
      Toast.show({
        icon: "fail",
        content: "表單填寫不完整！",
      });
      scrollToRef(datePickerRef);
    } else if (
      firstList.length !== 2 ||
      secondList.length !== 2 ||
      selfList.length !== 1 ||
      accountList.length !== 1
    ) {
      Toast.show({
        icon: "fail",
        content: "請上傳驗證照片！",
      });
    } else {
      Toast.show({
        icon: <UploadOutline />,
        content: "資料上傳中…",
      });

      console.log("BANK", formData); // send data to servers
      console.log("USER", userData); // send data to servers

      dispatch(setKycUserData(userData));
      dispatch(
        setKyc({
          SType: 1,
          P1: formData.account,
          P2: formData.accountName,
          P3: formData.bankCode,
          img1: formData.bankBook
        })
      );
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

  const userDataOnChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    if (!setKycError) return;
    Toast.show({
      icon: "fail",
      content: setKycError,
    });
  }, [setKycError, userKycError]);

  useEffect(() => {
    if (!userKycError) return;
    Toast.show({
      icon: "fail",
      content: userKycError,
    });
  }, [userKycError]);

  useEffect(() => {
    if (!kycData || !userKycData) return;

    Toast.show({
      icon: "success",
      content: "上傳成功，頁面即將跳轉",
      afterClose: () => {
        history.replace("/home");
        dispatch(cleanKycSetUserStatus());
        dispatch(cleanSetKycStatus());
      },
    });
  }, [kycData, history, userKycData, dispatch]);

  // const onBlurHandle = (e) => {
  //   if (e.target.id === "idNumber") {
  //     const showError = !isNationalIdentificationNumberValid(formData.idNumber);
  //     if (showError) {
  //       setBlurShowError((prev) => ({
  //         ...prev,
  //         [e.target.id]: true,
  //       }));
  //     } else {
  //       setBlurShowError((prev) => ({
  //         ...prev,
  //         [e.target.id]: false,
  //       }));
  //     }
  //     return;
  //   }
  //   if (e.currentTarget.checkValidity()) {
  //     setBlurShowError((prev) => ({
  //       ...prev,
  //       [e.target.id]: false,
  //     }));
  //   } else {
  //     setBlurShowError((prev) => ({
  //       ...prev,
  //       [e.target.id]: true,
  //     }));
  //   }
  // };

  return (
    <>
      {/* <Button onClick={() => dispatch(getKyc())}>GET</Button> */}
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
              onChange={userDataOnChange}
              value={userData.name}
              autoComplete="off"
              // onBlur={onBlurHandle}
              // isInvalid={blurShowError.name}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>電子信箱</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="輸入電子信箱"
              className="form-select mb-4 pl-3"
              onChange={userDataOnChange}
              value={userData.email}
              autoComplete="off"
              // onBlur={onBlurHandle}
              // isInvalid={blurShowError.email}
            />
          </Form.Group>

          {/* <Form.Group className="mb-3" controlId="validCode">
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
          </Form.Group> */}

          <Form.Group className="mb-3" controlId="birthday">
            <Form.Label>出生日期</Form.Label>
            <Form.Control
              ref={datePickerRef}
              required
              type="date"
              placeholder="選擇出生日期"
              className="form-date mb-4 pl-3"
              onChange={userDataOnChange}
              value={userData.birthday}
              autoComplete="off"
              // onBlur={onBlurHandle}
              // isInvalid={blurShowError.birthday}
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
              onChange={userDataOnChange}
              value={userData.country}
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
              ref={scrollRef}
              required
              placeholder="輸入身份證字號"
              className="form-select mb-4 pl-3"
              onChange={userDataOnChange}
              value={userData.idNumber}
              autoComplete="off"
              // onBlur={onBlurHandle}
              isInvalid={blurShowError.idNumber}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="idDate">
            <Form.Label>發證日期</Form.Label>
            <Form.Control
              required
              placeholder="選擇發證日期"
              className="form-date mb-4 pl-3"
              onChange={userDataOnChange}
              value={userData.idDate}
              autoComplete="off"
              // onBlur={onBlurHandle}
              // isInvalid={blurShowError.idDate}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="idLocation">
            <Form.Label>發證地點</Form.Label>
            <Form.Control
              required
              placeholder="輸入發證地點"
              className="form-select mb-4 pl-3"
              onChange={userDataOnChange}
              value={userData.idLocation}
              autoComplete="off"
              // onBlur={onBlurHandle}
              // isInvalid={blurShowError.idLocation}
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
              onChange={userDataOnChange}
              value={userData.idType}
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
                onChange={userDataOnChange}
                value={userData.city}
                id="city"
                autoComplete="off"
                // onBlur={onBlurHandle}
                // isInvalid={blurShowError.city}
              />

              <Form.Control
                required
                placeholder="請輸入區域"
                className="form-select mb-4 pl-3"
                onChange={userDataOnChange}
                value={userData.area}
                id="area"
                autoComplete="off"
                // onBlur={onBlurHandle}
                // isInvalid={blurShowError.area}
              />
            </div>

            <Form.Control
              required
              placeholder="請輸入地址"
              className="form-select mb-4 pl-3"
              onChange={userDataOnChange}
              value={userData.address}
              id="address"
              autoComplete="off"
              // onBlur={onBlurHandle}
              // isInvalid={blurShowError.address}
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
              // onBlur={onBlurHandle}
              // isInvalid={blurShowError.accountName}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bankCode">
            <Form.Label>銀行代號</Form.Label>
            <Form.Control
              required
              placeholder="輸入銀行代號"
              className="form-select mb-4 pl-3"
              onChange={onChange}
              value={formData.bankCode}
              autoComplete="off"
              type="number"
              onWheel={(event) => {
                event.currentTarget.blur();
              }}
              // onBlur={onBlurHandle}
              // isInvalid={blurShowError.bankCode}
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
              // onBlur={onBlurHandle}
              // isInvalid={blurShowError.account}
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
              upload={(file) => {
                let type;

                if (firstList.length === 0) {
                  type = "Front";
                } else {
                  type = "Back";
                }

                return mockUpload(file, `IDPhoto${type}`);
              }}
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
              upload={(file) => {
                let type;

                if (secondList.length === 0) {
                  type = "Front";
                } else {
                  type = "Back";
                }

                return mockUpload(file, `IDPhotoSecond${type}`);
              }}
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
              upload={(file) => mockUpload(file, "selfPhoto")}
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
              upload={(file) => mockUpload(file, "bankBook")}
              maxCount={1}
              showFailed={false}
              showUpload={accountList.length < 1}
              beforeUpload={beforeUpload}
            />
          </div>
        </div>

        {/* <Accordion style={{ marginTop: "3rem" }}>
          <Card>
            <Card.Header>
              <Accordion.Toggle
                style={{ color: "grey" }}
                as={Button}
                variant="link"
                eventKey="0"
              >
                <BsFillCaretDownFill />
                第二組銀行帳號 (選填)
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Form.Group className="mb-3" controlId="accountNameSecond">
                  <Form.Label>銀行戶名</Form.Label>
                  <Form.Control
                    required
                    placeholder="輸入銀行戶名"
                    className="form-select mb-4 pl-3"
                    onChange={onChange}
                    value={formData.accountNameSecond}
                    autoComplete="off"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="bankCodeSecond">
                  <Form.Label>銀行代號</Form.Label>
                  <Form.Control
                    required
                    placeholder="輸入銀行代號"
                    className="form-select mb-4 pl-3"
                    onChange={onChange}
                    value={formData.bankCodeSecond}
                    autoComplete="off"
                    type="number"
                    onWheel={(event) => {
                      event.currentTarget.blur();
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="accountSecond">
                  <Form.Label>銀行帳號</Form.Label>
                  <Form.Control
                    required
                    placeholder="輸入銀行帳號"
                    className="form-select mb-4 pl-3"
                    onChange={onChange}
                    value={formData.accountSecond}
                    autoComplete="off"
                    type="number"
                    onWheel={(event) => {
                      event.currentTarget.blur();
                    }}
                  />
                </Form.Group>

                <div style={{ marginTop: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>上傳存摺正面</span>
                  </div>
                  <ImageUploader
                    style={{ "--cell-size": "140px" }}
                    value={accountListSecond}
                    onChange={setAccountListSecond}
                    upload={(file) => mockUpload(file, "bankBookSecond")}
                    maxCount={1}
                    showFailed={false}
                    showUpload={accountListSecond.length < 1}
                    beforeUpload={beforeUpload}
                  />
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion> */}

        {/* <Accordion style={{ marginTop: "3rem" }}>
          <Card>
            <Card.Header>
              <Accordion.Toggle
                style={{ color: "grey" }}
                as={Button}
                variant="link"
                eventKey="0"
              >
                <BsFillCaretDownFill />
                第三組銀行帳號(選填)
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Form.Group className="mb-3" controlId="accountNameThird">
                  <Form.Label>銀行戶名</Form.Label>
                  <Form.Control
                    required
                    placeholder="輸入銀行戶名"
                    className="form-select mb-4 pl-3"
                    onChange={onChange}
                    value={formData.accountNameThird}
                    autoComplete="off"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="bankCodeThird">
                  <Form.Label>銀行代號</Form.Label>
                  <Form.Control
                    required
                    placeholder="輸入銀行代號"
                    className="form-select mb-4 pl-3"
                    onChange={onChange}
                    value={formData.bankCodeThird}
                    autoComplete="off"
                    type="number"
                    onWheel={(event) => {
                      event.currentTarget.blur();
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="accountThird">
                  <Form.Label>銀行帳號</Form.Label>
                  <Form.Control
                    required
                    placeholder="輸入銀行帳號"
                    className="form-select mb-4 pl-3"
                    onChange={onChange}
                    value={formData.accountThird}
                    autoComplete="off"
                    type="number"
                    onWheel={(event) => {
                      event.currentTarget.blur();
                    }}
                  />
                </Form.Group>

                <div style={{ marginTop: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>上傳存摺正面</span>
                  </div>
                  <ImageUploader
                    style={{ "--cell-size": "140px" }}
                    value={accountListThird}
                    onChange={setAccountListThird}
                    upload={(file) => mockUpload(file, "bankBookThird")}
                    maxCount={1}
                    showFailed={false}
                    showUpload={accountListThird.length < 1}
                    beforeUpload={beforeUpload}
                  />
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion> */}

        <Button
          variant="primary"
          type="button"
          disabled={setKycLoading || kycData || userKycLoading || userKycData}
          style={{ height: "5rem", marginTop: "3rem", fontSize: "2rem" }}
          onClick={() => {
            formBtnRef.current.click();
          }}
        >
          {setKycLoading || userKycLoading ? "Loading..." : "填寫完成"}
        </Button>
      </Card>
    </>
  );
};

export default KycValidForm;
