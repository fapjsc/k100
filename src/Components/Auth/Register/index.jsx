import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import validator from "validator";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

// Lang Context
import { useI18n } from "../../../lang";

// Components
import ValidCode from "./ValidCode";


// Style
import { Form, Button, Col, Fade, Spinner } from "react-bootstrap";
import "./index.scss";

const RegisterForm = () => {
  // Lang Context
  const { t } = useI18n();

  // Router Props
  const history = useHistory();

  const [phoneNumber, setPhoneNumber] = useState({
    val: "",
    isValid: true,
    error: "",
  });

  const [password, setPassword] = useState({
    val: "",
    isValid: true,
    error: "",
  });

  const [confirmPassword, setConfirmPassword] = useState({
    val: "",
    isValid: true,
    error: "",
  });

  const [countryCode, setCountryCode] = useState({
    val: process.env.REACT_APP_HOST_NAME === "K100U" ? "" : "886",
    isValid: true,
    error: "",
  });

  const [captcha, setCaptcha] = useState({
    val: "",
    isValid: true,
    error: "",
  });

  const [checkAccountErr, setCheckAccountErr] = useState("");

  const [agree, setAgree] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [showValidCode, setShowValidCode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const handlePhoneNumber = (event) => {
    if (event.target.value.startsWith("0")) {
      event.target.value = event.target.value.split("0")[1];
    }

    setPhoneNumber({
      val: event.target.value.trim(),
      isValid: true,
      error: "",
    });
  };

  const handlePassword = (event) => {
    setPassword({
      val: event.target.value.trim(),
      isValid: true,
      error: "",
    });
  };

  const handleConfirmPassword = (event) => {
    setConfirmPassword({
      val: event.target.value.trim(),
      isValid: true,
      error: "",
    });
  };

  const handleCountryCode = (e) => {
    // 中國
    if (e.target.value.includes("86")) {
      setCountryCode({
        val: '86',
        isValid: true,
        error: "",
      });
      setShowAlert(true);
    }

    // 台灣
    if (e.target.value.includes("886")) {
      setCountryCode({
        val: '886',
        isValid: true,
        error: "",
      });

      setShowAlert(false);
    }

    // 香港
    if (e.target.value.includes("852")) {
      setCountryCode({
        val: '852',
        isValid: true,
        error: "",
      });
      setShowAlert(false);
    }

    // 馬來西亞
    if (e.target.value.includes("60")) {
      setCountryCode({
        val: '60',
        isValid: true,
        error: "",
      });
      setShowAlert(false);
    }

    // 新加波
    if (e.target.value.includes("65")) {
      setCountryCode({
        val: '65',
        isValid: true,
        error: "",
      });
      setShowAlert(false);
    }

    // 菲律賓
    if (e.target.value === "菲律宾＋63") {
      setCountryCode({
        val: '63',
        isValid: true,
        error: "",
      });
    }
  };

  const handleCaptcha = (e) => {
    setCaptcha({
      val: e.target.value,
      isValid: true,
      error: "",
    });
  };

  const handleAgree = (event) => {
    setAgree(event.target.checked);
  };

  const validRegister = async () => {
    setFormIsValid(true);


    // captcha
    if (!validateCaptcha(captcha.val)) {
      setCaptcha({
        val: "",
        isValid: false,
        error: t("captcha_error"),
      });
      setFormIsValid(false);
      setBtnLoading(false);
    }

    //驗證區碼
    if (countryCode.val === "" || countryCode.val === null) {
      setCountryCode({
        val: null,
        isValid: false,
        error: t("no_countryCode"),
      });
      setFormIsValid(false);
      setBtnLoading(false);
    }

    // 驗證中國手機是否為11碼
    if (countryCode.val === '86' && phoneNumber.val.length !== 11) {
      setPhoneNumber({
        val: "",
        isValid: false,
        error: t("invalid_phoneNumber"),
      });

      setFormIsValid(false);
      setBtnLoading(false);
    }

    // 驗證香港手機是否為8碼
    if (countryCode.val === '852' && phoneNumber.val.length !== 8) {
      setPhoneNumber({
        val: "",
        isValid: false,
        error: t("invalid_phoneNumber"),
      });

      setFormIsValid(false);
      setBtnLoading(false);
    }

    // 驗證台灣手機是否為9碼
    if (countryCode.val === '886' && phoneNumber.val.length !== 9) {
      setPhoneNumber({
        val: "",
        isValid: false,
        error: t("invalid_phoneNumber"),
      });

      setFormIsValid(false);
      setBtnLoading(false);
    }

    // 驗證電話號碼
    if (phoneNumber.val === "" || !validator.isMobilePhone(phoneNumber.val)) {
      setPhoneNumber({
        val: "",
        isValid: false,
        error: t("invalid_phoneNumber"),
      });

      setFormIsValid(false);
      setBtnLoading(false);
    }

    //驗證密碼
    if (
      password.val === "" ||
      !validator.isAlphanumeric(password.val) ||
      password.val.length < 6
    ) {
      setPassword({
        val: "",
        isValid: false,
        error: t("invalid_password"),
      });

      setFormIsValid(false);
      setBtnLoading(false);
    }

    if (password.val !== confirmPassword.val) {
      setConfirmPassword({
        val: confirmPassword.val,
        isValid: false,
        error: t("confirm_password_fail"),
      });

      setFormIsValid(false);
      setBtnLoading(false);
    }
  };

  const gotToAgreePage = () => {
    history.push("/agreement");
  };

  const checkAccountExists = async (data) => {
    const checkAccount = `/j/ChkLoginExists.aspx`;

    const res = await fetch(checkAccount, {
      method: "POST",
      body: JSON.stringify({
        reg_countrycode: data.countryCode,
        reg_tel: data.phoneNumber,
      }),
    });

    const resData = await res.json();

    if (resData.code === 200) {
      setShowValidCode(true);
    }

    if (resData.code === "11") {
      setCheckAccountErr(t("http_error_code_11"));
      setFormIsValid(false);
      setBtnLoading(false);
    }

    setBtnLoading(false);
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault(); //防止表單提交

    setBtnLoading(true);

    await validRegister();
  };

  useEffect(() => {
    if (formIsValid) {
      const data = {
        countryCode: countryCode.val,
        phoneNumber: phoneNumber.val,
      };

      checkAccountExists(data);
    }
    return () => {
      setFormIsValid(false);
    };
    // eslint-disable-next-line
  }, [formIsValid]);

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  return (
    <>
      <div className="form-container">
        {!showValidCode ? (
          <Form>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="CountryCode">
                {process.env.REACT_APP_HOST_NAME === "88U" && (
                  <Form.Control
                    type="text"
                    name="countryCode"
                    className="form-select mb-4 pl-3"
                    disabled
                    // defaultValue='886'
                    placeholder="台灣 +886"
                    onChange={handleCountryCode}
                    isInvalid={countryCode.error}
                  />
                )}

                {process.env.REACT_APP_HOST_NAME === "K100U" && (
                  <Form.Control
                    style={{
                      fontSize: "17px",
                      color: "#495057",
                    }}
                    as="select"
                    defaultValue={t("countryCode")}
                    className="form-select mb-4 pl-3"
                    onChange={handleCountryCode}
                    isInvalid={!countryCode.isValid}
                  >
                    <option disabled>{t("countryCode")}</option>
                    <option>{t("taiwan")}</option>
                    <option>{t("china")}</option>
                    <option>{t("hk")}</option>
                    <option>{t("philippines")}</option>
                  </Form.Control>
                )}

                {countryCode.error && (
                  <Form.Text
                    style={{
                      fontSize: "12px",
                    }}
                    className="mb-4"
                  >{`*${countryCode.error}`}</Form.Text>
                )}
              </Form.Group>

              <Form.Group as={Col} md="8" controlId="formBasicPhoneNumber">
                <input
                  className="form-control form-select mb-4"
                  size="lg"
                  type="number"
                  placeholder={t("phoneNumber")}
                  onChange={handlePhoneNumber}
                  isInvalid={!phoneNumber.isValid}
                  autoComplete="off"
                  onWheel={(event) => {
                    event.currentTarget.blur();
                  }}
                />
                {phoneNumber.error && (
                  <Form.Text
                    style={{
                      fontSize: "12px",
                    }}
                    className="mb-4"
                  >{`*${phoneNumber.error}`}</Form.Text>
                )}
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xl={12} controlId="formBasicPassword">
                <Form.Control
                  className="form-select mb-4"
                  size="lg"
                  type="password"
                  placeholder={t("enter_password")}
                  onChange={handlePassword}
                  isInvalid={!password.isValid}
                />
                {password.error && (
                  <Form.Text
                    style={{
                      fontSize: "12px",
                    }}
                    className="mb-4"
                  >{`*${password.error}`}</Form.Text>
                )}
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xl={12} controlId="formConfirmPassword">
                <Form.Control
                  className="form-select mb-4"
                  size="lg"
                  type="password"
                  placeholder={t("enter_confirm_password")}
                  onChange={handleConfirmPassword}
                />
                {confirmPassword.error && (
                  <Form.Text
                    style={{
                      fontSize: "12px",
                    }}
                    className="mb-4"
                  >{`*${confirmPassword.error}`}</Form.Text>
                )}
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xl={12}>
                <Form.Control
                  isInvalid={captcha.error}
                  style={{
                    fontSize: "12px",
                  }}
                  className="form-select mb-4"
                  size="lg"
                  placeholder={t("captcha_check")}
                  value={captcha.val}
                  onChange={handleCaptcha}
                  autoComplete="off"
                />
                {captcha.error && (
                  <Form.Text
                    className="mb-4"
                    style={{ fontSize: "12px" }}
                  >{`*${captcha.error}`}</Form.Text>
                )}

                {checkAccountErr && (
                  <Form.Text
                    className="mb-4"
                    style={{ fontSize: "12px" }}
                  >{`*${checkAccountErr}`}</Form.Text>
                )}
                <LoadCanvasTemplate style={{ width: 150, height: 30 }} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group
                controlId="formBasicCheckbox"
                className="user-agreement"
              >
                <Form.Check
                  className="user-agreement__check"
                  type="checkbox"
                  label={t("read_and_agree")}
                  onChange={handleAgree}
                  checked={agree}
                />
                <span
                  style={{
                    cursor: "pointer",
                    fontSize: 12,
                    alignSelf: "flex-end",
                    marginBottom: 1,
                  }}
                  onClick={gotToAgreePage}
                >{`${t("user_agreement")}`}</span>
              </Form.Group>
            </Form.Row>

            <Button
              onClick={handleRegisterSubmit}
              className="form-btn"
              // variant="primary"
              variant={!agree || btnLoading ? "secondary" : "primary"}
              block
              type="submit"
              disabled={!agree || btnLoading}
            >
              {btnLoading && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="md"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {btnLoading ? `${t("btn_loading")}...` : t("btn_next")}
            </Button>
            <br />
            {showAlert && (
              <Fade in={showAlert}>
                <div id="example-fade-text" className="text-danger">
                  <div className="d-flex align-items-center mb-2">
                    <svg
                      xmlns="../../../Assets/cone-striped.svg"
                      width="16"
                      height="16"
                      fill="red"
                      class="bi bi-cone-striped"
                      viewBox="0 0 16 16"
                    >
                      <path d="m9.97 4.88.953 3.811C10.159 8.878 9.14 9 8 9c-1.14 0-2.158-.122-2.923-.309L6.03 4.88C6.635 4.957 7.3 5 8 5s1.365-.043 1.97-.12zm-.245-.978L8.97.88C8.718-.13 7.282-.13 7.03.88L6.275 3.9C6.8 3.965 7.382 4 8 4c.618 0 1.2-.036 1.725-.098zm4.396 8.613a.5.5 0 0 1 .037.96l-6 2a.5.5 0 0 1-.316 0l-6-2a.5.5 0 0 1 .037-.96l2.391-.598.565-2.257c.862.212 1.964.339 3.165.339s2.303-.127 3.165-.339l.565 2.257 2.391.598z" />
                    </svg>
                    <p className="ml-3 mb-0" style={{ color: "red" }}>
                      {t("china_area_alert_1")}
                    </p>
                  </div>
                  <p style={{ color: "red" }}>{t("china_area_alert_2")}</p>
                </div>
              </Fade>
            )}
          </Form>
        ) : (
          <ValidCode
            phoneNumber={phoneNumber.val}
            countryCode={countryCode.val}
            password={password.val}
          />
        )}
      </div>
    </>
  );
};

export default RegisterForm;
