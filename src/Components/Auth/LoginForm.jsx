import { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import validator from "validator";

// Context
import AuthContext from "../../context/auth/AuthContext";

// Lang Context
import { useI18n } from "../../lang";

// Style
import { Form, Col, Spinner, Button } from "react-bootstrap";
import "./Login/index.scss";

const LoginForm = () => {
  const history = useHistory();

  // Lang Context
  const { t } = useI18n();

  // Auth Context
  const authContext = useContext(AuthContext);
  const { login, loginLoading, errorText, setErrorText } = authContext;

  // Init State
  const [countryCode, setCountryCode] = useState({
    val: process.env.REACT_APP_HOST_NAME === "K100U" ? "" : "886",
    isValid: true,
    error: "",
  });

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

  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (formIsValid) {
      const data = {
        countryCode: countryCode.val,
        phoneNumber: phoneNumber.val,
        password: password.val,
      };

      login(data);

      setFormIsValid(false);
    }
    // eslint-disable-next-line
  }, [formIsValid]);

  useEffect(() => {
    return () => {
      setErrorText("");
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (localStorage.getItem("agent") && localStorage.getItem("token")) {
      history.replace("/home");
    }
  }, [history]);

  // 按下enter後登入
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) validateForm();
  };

  const onChange = (e) => {
    setErrorText("");
    if (e.target.name === "countryCode") {
      // 中國
      if (e.target.value.includes("86")) {
        setCountryCode({
          val: "86",
          isValid: true,
          error: "",
        });
      }

      // 台灣
      if (e.target.value.includes("886")) {
        setCountryCode({
          val: "886",
          isValid: true,
          error: "",
        });
      }

      // 香港
      if (e.target.value.includes("852")) {
        setCountryCode({
          val: "852",
          isValid: true,
          error: "",
        });
      }

      // 馬來西亞
      if (e.target.value.includes("ˊ60")) {
        setCountryCode({
          val: "60",
          isValid: true,
          error: "",
        });
      }

      // 新加波
      if (e.target.value.includes("65")) {
        setCountryCode({
          val: "65",
          isValid: true,
          error: "",
        });
      }

      // 菲律賓
      if (e.target.value === "菲律宾＋63") {
        setCountryCode({
          val: "63",
          isValid: true,
          error: "",
        });
      }
    }

    if (e.target.name === "phoneNumber") {
      if (e.target.value.startsWith("0")) {
        e.target.value = e.target.value.split("0")[1];
      }

      setPhoneNumber({
        val: e.target.value.trim(),
        isValid: true,
        error: "",
      });
    }

    if (e.target.name === "password") {
      setPassword({
        val: e.target.value.trim(),
        isValid: true,
        error: "",
      });
    }
  };

  // valid
  const validateForm = async () => {
    setFormIsValid(true);

    // 驗證區碼
    if (!countryCode.val) {
      setCountryCode({
        val: "",
        isValid: false,
        error: t("no_countryCode"),
      });

      setFormIsValid(false);
    }

    // 驗證電話號碼
    if (phoneNumber.val === "" || !validator.isMobilePhone(phoneNumber.val)) {
      setPhoneNumber({
        val: "",
        isValid: false,
        error: t("invalid_phoneNumber"),
      });

      setFormIsValid(false);
    }

     // 驗證台灣手機是否為9碼
     if (countryCode.val === 886 && phoneNumber.val.length !== 9) {
      setPhoneNumber({
        val: "",
        isValid: false,
        error: t("invalid_phoneNumber"),
      });

      setFormIsValid(false);
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
    }
  };

  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col} md="4" controlId="CountryCode">
          {process.env.REACT_APP_HOST_NAME === "88U" && (
            <Form.Control
              type="text"
              name="countryCode"
              className="form-select mb-4 pl-3"
              disabled
              // defaultValue={countryCode.val}
              placeholder="台灣 +886"
              onChange={onChange}
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
              // defaultValue={t("countryCode")}
              defaultValue={t("countryCode")}
              className="form-select mb-4 pl-3"
              name="countryCode"
              onChange={onChange}
              isInvalid={countryCode.error}
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
              className="mb-4"
              style={{ fontSize: "12px" }}
            >{`*${countryCode.error}`}</Form.Text>
          )}
        </Form.Group>

        <Form.Group as={Col} md="8" controlId="formBasicPhoneNumber">
          <Form.Control
            isInvalid={phoneNumber.error}
            className="form-select mb-4"
            name="phoneNumber"
            size="lg"
            type="number"
            placeholder={t("phoneNumber")}
            onChange={onChange}
            value={phoneNumber.val}
            // onChange={this.setPhoneNumber}
            onWheel={(event) => {
              event.currentTarget.blur();
            }}
            autoComplete="off"
          />
          {phoneNumber.error && (
            <Form.Text
              className="mb-4"
              style={{ fontSize: "12px" }}
            >{`*${phoneNumber.error}`}</Form.Text>
          )}
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} xl={12} controlId="formBasicPassword">
          <Form.Control
            isInvalid={password.error}
            className="form-select mb-4"
            name="password"
            size="lg"
            type="password"
            placeholder={t("password")}
            onChange={onChange}
            value={password.val}
            onKeyUp={handleKeyUp}
            autoComplete="off"
          />
          {password.error && (
            <Form.Text
              className="mb-4"
              style={{ fontSize: "12px" }}
            >{`*${password.error}`}</Form.Text>
          )}

          {errorText && (
            <Form.Text
              className="mb-4"
              style={{ fontSize: "12px" }}
            >{`*${errorText}`}</Form.Text>
          )}
        </Form.Group>
      </Form.Row>

      <Button
        onClick={validateForm}
        style={{
          display: "block",
          width: "100%",
          background: loginLoading ? "grey" : "#3e80f9",
          cursor: loginLoading ? "auto" : "pointer",
        }}
        disabled={loginLoading}
        className="easy-btn"
        type="button"
      >
        {loginLoading && (
          <Spinner
            as="span"
            animation="border"
            size="lg"
            role="status"
            aria-hidden="true"
            className="mr-2"
          />
        )}

        <span>{loginLoading ? `${t("btn_loading")}...` : t("btn_login")}</span>
      </Button>
      <div className="forget_pw-box">
        <Link to="/forget-pw" className="forget_pw-link">
          <span className="forget_pw"></span>
          <u>{t("btn_forget_password")}</u>
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
