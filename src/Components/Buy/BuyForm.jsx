import { useState, useEffect, useContext } from "react";

// Context
import SellContext from "../../context/sell/SellContext";
import BuyContext from "../../context/buy/BuyContext";
import HttpErrorContext from "../../context/httpError/HttpErrorContext";
import { useI18n } from "../../lang";

// Style
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import changeMoney from "../../Assets/i_twoways.png";
import "./index.scss";

const BuyForm = () => {
  // Lang Context
  const { t } = useI18n();

  // sell context
  const sellContext = useContext(SellContext);
  const { buyRate } = sellContext;

  // but context
  const buyContext = useContext(BuyContext);
  const {
    setBuyCount,
    buyCount,
    buyErrorText,
    setErrorText,
    setShowBank,
    showBank,
  } = buyContext;

  // http error context
  const httpErrorContext = useContext(HttpErrorContext);
  const { setHttpError } = httpErrorContext;

  // Init State
  const [usdtAmt, setUsdtAmt] = useState({
    val: "",
    isValid: true,
    error: "",
  });

  const [rmbAmt, setRmbAmt] = useState({
    val: "",
    isValid: true,
    error: "",
  });

  const [formIsValid, setFormIsValid] = useState(false);

  //===========
  // UseEffect
  //===========

  // unMount後清除錯誤提示
  useEffect(() => {
    return () => {
      setHttpError(""); // http錯誤提示
      setErrorText(""); // 前端表單驗證錯誤提示
    };
    // eslint-disable-next-line
  }, []);

  // Set Buy Count
  useEffect(() => {
    setBuyCount({
      usdt: usdtAmt.val,
      rmb: rmbAmt.val,
    });

    // eslint-disable-next-line
  }, [usdtAmt, rmbAmt]);

  // Render Bank Form
  useEffect(() => {
    if (formIsValid) {
      setShowBank(true);
    }

    return () => {
      setFormIsValid(false);
    };
    //eslint-disable-next-line
  }, [formIsValid]);

  useEffect(() => {
    return () => {
      setShowBank(false);
    };
    // eslint-disable-next-line
  }, []);

  const onChange = (e) => {
    setHttpError(""); // http錯誤提示
    setErrorText(""); // 前端表單驗證錯誤提示
    if (e.target.name === "usdtAmt") {
      if (e.target.value < 0 || e.target.value === "e") {
        setUsdtAmt({
          val: "",
          isValid: true,
          error: "",
        });
        return;
      }

      let rmb = Number(e.target.value * buyRate).toFixed(2);

      setUsdtAmt({
        val: e.target.value.trim(),
        isValid: true,
        error: "",
      });

      setRmbAmt({
        val: rmb,
        isValid: true,
        error: "",
      });

      if (!e.target.val) setShowBank(false);
    }

    if (e.target.name === "rmbAmt") {
      if (e.target.value < 0 || e.target.value === "e") {
        setRmbAmt({
          val: "",
          isValid: true,
          error: "",
        });
        return;
      }

      let usdt = Number(e.target.value / buyRate).toFixed(2);

      setRmbAmt({
        val: e.target.value.trim(),
        isValid: true,
        error: "",
      });

      setUsdtAmt({
        val: usdt,
        isValid: true,
        error: "",
      });

      if (!e.target.val) setShowBank(false);
    }
  };

  // Valid Form
  const validCount = () => {
    setFormIsValid(true);

    // 有1~2位小数的正數，且不能為0或0開頭
    let rule = /^([1-9][0-9]*)+(\.[0-9]{1,2})?$/;
    if (!rule.test(usdtAmt.val) || !rule.test(rmbAmt.val)) {
      setUsdtAmt({
        val: "",
        isValid: false,
        error: t("invalid_number"),
      });

      setFormIsValid(false);
    }
  };
  return (
    <Form style={formStyle}>
      {/* <button onClick={() => setLocale('zh-HK')}>繁體</button>
      <button onClick={() => setLocale('zh-CN')}>簡體</button> */}
      <Form.Row className="align-items-center">
        <Form.Group as={Col} xl={5} controlId="usdt" className="">
          <Form.Control
            style={formInput}
            className="align-self-center easy-border"
            placeholder={t("please_enter_quantity")}
            value={buyCount.usdt}
            onChange={onChange}
            name="usdtAmt"
            autoComplete="off"
            type="number"
            isInvalid={usdtAmt.error}
            onWheel={(event) => event.currentTarget.blur()}
          />

          <span style={inputText}>USDT</span>
          {usdtAmt.error && (
            <Form.Text
              className=""
              style={{
                fontSize: "12px",
              }}
            >
              <span className="">*{usdtAmt.error}</span>
            </Form.Text>
          )}

          {buyErrorText && (
            <Form.Text
              className=""
              style={{
                fontSize: "12px",
              }}
            >
              <span className="">*{buyErrorText}</span>
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group as={Col} className="transaction-twoWay">
          <img className="twoWay-icon" src={changeMoney} alt="change money" />
        </Form.Group>

        <Form.Group className="" as={Col} xl={5} controlId="cny">
          <Form.Control
            style={formInput}
            value={buyCount.rmb}
            onChange={onChange}
            name="rmbAmt"
            autoComplete="off"
            type="number"
            className="easy-border"
            onWheel={(event) => event.currentTarget.blur()}
          />
          <span style={inputText}>CNY</span>
        </Form.Group>
      </Form.Row>

      {usdtAmt.val && (
        <Form.Row className="mt-4">
          <Form.Group as={Col} className="mt-4">
            <p className="txt_12">{t("e_wallet")}</p>
            <Button
              type="button"
              style={{
                marginTop: -8,
                marginRight: 15,
              }}
              // className="walletBtn"
              className={showBank ? "walletBtnActive" : "walletBtn"}
              onClick={validCount}
            >
              {t("btn_bank")}
            </Button>

            <Button
              type="button"
              className="disableWalletBtn"
              style={{
                marginTop: -8,
              }}
            >
              {t("btn_aliPay")}
            </Button>
            <Form.Text style={{ fontSize: 12 }}>
              {t("choose_e_wallet")}
            </Form.Text>
          </Form.Group>
        </Form.Row>
      )}
    </Form>
  );
};

const formStyle = {
  marginTop: 20,
};

const formInput = {
  padding: 30,
};

const inputText = {
  color: "#D7E2F3",
  position: "absolute",
  top: "50%",
  transform: "translateY(-45%)",
  right: 35,
  fontSize: 17,
};

export default BuyForm;
