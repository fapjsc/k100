import { Fragment, useState, useContext, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

// Context
import SellContext from "../../context/sell/SellContext";
import BalanceContext from "../../context/balance/BalanceContext";
import HttpErrorContext from "../../context/httpError/HttpErrorContext";

// Lang Context
import { useI18n } from "../../lang";

// Components
import BaseSpinner from "../Ui/BaseSpinner";

// Utils
import { locationMoneyPrefix } from "../../lib/utils";

// Style
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import changeMoney from "../../Assets/i_twoways.png";

const SellForm = () => {
  const mobileApp = useMediaQuery({ query: "(max-width: 1199px)" });

  // Lang Context
  const { t } = useI18n();

  // Balance Context
  const balanceContext = useContext(BalanceContext);
  const { getBalance, avb } = balanceContext;

  // Sell Context
  const sellContext = useContext(SellContext);
  const { getExRate, exRate, setSellCount, setShowBank } = sellContext;

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  const [usdt, setUsdt] = useState({
    val: "",
    isValid: true,
    error: "",
  });

  const [cny, setCny] = useState({
    val: "",
    isValid: true,
    error: "",
  });

  const [formValid, setFormValid] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showBankWallet, setShowBankWallet] = useState(false);

  useEffect(() => {
    getExRate();
    getBalance();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const data = {
      usdt: usdt.val,
      cny: cny.val,
    };
    setSellCount(data);
    // eslint-disable-next-line
  }, [usdt, cny]);

  useEffect(() => {
    if (formValid) {
      setShowBank(true);
    }
    return setFormValid(false);
    // eslint-disable-next-line
  }, [formValid]);

  useEffect(() => {
    if (errorText) alert(errorText);
    return () => {
      setHttpError("");
    };
    // eslint-disable-next-line
  }, [errorText]);

  const onChange = (e) => {
    if (!e.target.val) setShowBank(false);
    if (e.target.name === "usdt") {
      if (e.target.value < 0 || e.target.value === "e") {
        setUsdt({
          val: "",
          isValid: true,
          error: "",
        });
        return;
      }

      let counter = (e.target.value * exRate).toFixed(2);
      setCny({
        val: counter,
        isValid: true,
        error: "",
      });
      setUsdt({
        val: e.target.value.trim(),
        isValid: true,
        error: "",
      });

      if (!e.target.val) setShowBankWallet(false);
    }

    if (e.target.name === "cny") {
      if (e.target.value < 0 || e.target.value === "e") {
        setCny({
          val: "",
          isValid: true,
          error: "",
        });
        return;
      }
      let counter = (e.target.value / exRate).toFixed(2);
      setUsdt({
        val: counter,
        isValid: true,
        error: "",
      });
      setCny({
        val: e.target.value.trim(),
        isValid: true,
        error: "",
      });

      if (!e.target.val) setShowBankWallet(false);
    }
  };

  // 提取所有
  const fetchAll = async () => {
    setFetchLoading(true);
    await getBalance();

    let usdtCount = Number(avb).toFixed(2);
    let cnyCount = (usdtCount * Number(exRate)).toFixed(2);

    if (usdtCount <= 0) {
      usdtCount = 0;
      cnyCount = 0;
    }

    setUsdt({
      val: usdtCount,
      isValid: true,
      error: "",
    });

    setCny({
      val: cnyCount,
      isValid: true,
      error: "",
    });

    if (avb <= 0)
      setUsdt({ val: "", isValid: false, error: t("avb_insufficient") });

    setFetchLoading(false);
  };

  // 表單驗證
  const validForm = () => {
    setFormValid(true);

    if (Number(usdt.val) > Number(avb)) {
      setUsdt({
        val: usdt.val,
        isValid: false,
        error: t("avb_over_limit"),
      });

      setFormValid(false);
    }

    if (usdt.val === "" || usdt.val <= 0) {
      setUsdt({
        val: "",
        isValid: false,
        error: t("sell_error_invalid_number"),
      });

      setFormValid(false);
    }

    if (cny.val === "" || cny.val <= 0) {
      setCny({
        val: "",
        isValid: false,
        error: t("sell_error_invalid_number"),
      });

      setFormValid(false);
    }

    // 有1~2位小数的正數，且不能為0或0開頭
    let rule = /^([1-9][0-9]*)+(\.[0-9]{1,2})?$/;
    if (!rule.test(usdt.val) || !rule.test(cny.val)) {
      setUsdt({
        val: "",
        isValid: false,
        error: t("sell_error_invalid_number"),
      });

      setCny({
        val: "",
        isValid: true,
        error: "",
      });

      setFormValid(false);
    }
  };

  // const onSubmit = e => {
  //   e.preventDefault();
  //   validForm();
  // };

  return (
    <Fragment>
      {exRate ? (
        <Form>
          {/* sell count */}
          <Form.Row
            className="mt-4"
            style={{
              marginBottom: "-12px",
            }}
          >
            <Form.Group
              as={Col}
              xl={5}
              className="mb-0 d-flex justify-content-end pr-0"
            >
              {fetchLoading ? (
                <Button variant="secondary" disabled className="" style={{}}>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                  {t("btn_loading")}...
                </Button>
              ) : (
                <Button
                  disabled={fetchLoading}
                  variant="outline-primary"
                  size="lg"
                  className=""
                  onClick={fetchAll}
                  style={{}}
                >
                  {t("btn_fetch_all")}
                </Button>
              )}
            </Form.Group>
          </Form.Row>

          <Form.Row className="mt-4">
            <Form.Group as={Col} xl={5} controlId="usdt" className="p-0 m-0">
              <Form.Control
                onWheel={(event) => event.currentTarget.blur()}
                className="easy-border"
                placeholder={t("sell_enter_qua")}
                autoComplete="off"
                type="number"
                step="number"
                // step="any"
                isInvalid={!usdt.isValid}
                value={usdt.val}
                name="usdt"
                onChange={onChange}
                style={{
                  padding: 30,
                  fontSize: 20,
                }}
              />

              {/* 錯誤提示 */}
              {usdt.error && (
                <Form.Text className="" style={{ fontSize: "12px" }}>
                  *{usdt.error}
                </Form.Text>
              )}

              <span style={inputText}>USDT</span>
            </Form.Group>

            {/* img */}
            <Form.Group
              as={Col}
              className=" my-3 d-flex align-items-start justify-content-center"
            >
              <img
                className=""
                src={changeMoney}
                alt="change money"
                style={mobileApp ? changeMoneyIconMobile : changeMoneyIcon}
              />
            </Form.Group>

            <Form.Group as={Col} xl={5} controlId="cny" className="m-0 p-0">
              <Form.Control
                onWheel={(event) => event.currentTarget.blur()}
                className="easy-border"
                autoComplete="off"
                type="number"
                step="any"
                name="cny"
                isInvalid={!cny.isValid}
                value={cny.val}
                onChange={onChange}
                style={{
                  padding: 30,
                  fontSize: 20,
                }}
              />

              <span style={inputText}>{locationMoneyPrefix()}</span>
            </Form.Group>
          </Form.Row>

          {usdt.val && (
            <Form.Row className="mt-4">
              <Form.Group as={Col} className="mt-4">
                <p className="txt_12">{t("e_wallet")}</p>
                <Button
                  type="button"
                  style={{
                    marginTop: -8,
                    marginRight: 15,
                  }}
                  className={showBankWallet ? "walletBtnActive" : "walletBtn"}
                  onClick={validForm}
                >
                  {t("btn_bank")}
                </Button>

                {process.env.React_APP_HOST_NAME === "K100U" && (
                  <Button
                    type="button"
                    className="disableWalletBtn"
                    style={{
                      marginTop: -8,
                    }}
                  >
                    {t("btn_aliPay")}
                  </Button>
                )}

                <Form.Text style={{ fontSize: 12 }}>
                  {t("choose_e_wallet")}
                </Form.Text>
              </Form.Group>
            </Form.Row>
          )}
        </Form>
      ) : (
        <BaseSpinner />
      )}
    </Fragment>
  );
};

const changeMoneyIcon = {
  width: 45,
};

const changeMoneyIconMobile = {
  transform: "rotate(90deg)",
  width: 45,
};

const inputText = {
  color: "#D7E2F3",
  position: "absolute",
  top: 0,
  transform: "translateY(75%)",
  right: 30,
  fontSize: 17,
};

export default SellForm;
