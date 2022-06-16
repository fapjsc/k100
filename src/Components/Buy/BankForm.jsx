import { useContext, useState, useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Antd
import { Modal } from "antd-mobile";

import {

  locationMoneyCalcWithThousand,
  usdtThousandBitSeparator
} from "../../lib/utils";

// Context
import BuyContext from "../../context/buy/BuyContext";
import HttpErrorContext from "../../context/httpError/HttpErrorContext";
import { useI18n } from "../../lang";

// Style
import ButtonB from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

// Actions
import { setBuyBankForm } from "../../store/actions/bankFormActions";

// Images
import cautionImag from "../../Assets/88u/icon_注意.png";

// Utils
import { locationMoneyPrefix, thousandBitSeparator } from "../../lib/utils";

const BankFrom = () => {
  // Lang Context
  const { t } = useI18n();

  const dispatch = useDispatch();
  const { buy } = useSelector((state) => state.bankForm);
  const {
    accountName: defaultAccountName,
    bankCode: defaultBankCode,
    account: defaultAccount,
  } = buy || {};

  // Buy Context
  const buyContext = useContext(BuyContext);
  const {
    buyBtnLoading,
    buyCount,
    setErrorText,
    confirmBuy,
    handleBuyBtnLoading,
  } = buyContext;

  // Http Error context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  const [accountName, setAccountName] = useState({
    val: defaultAccountName || "",
    isValid: true,
    error: "",
  });

  const [account, setAccount] = useState({
    val: defaultAccount || "",
    isValid: true,
    error: "",
  });

  const [bankCode, setBankCode] = useState({
    val: defaultBankCode || "",
    isValid: true,
    error: "",
  });

  const [formIsValid, setFormIsValid] = useState(false);

  // unMount後清除錯誤提示
  useEffect(() => {
    if (errorText) {
      handleBuyBtnLoading(false);
    }

    return () => {
      setHttpError(""); // http錯誤提示
      setErrorText(""); // 前端表單驗證錯誤提示
    };
    // eslint-disable-next-line
  }, [errorText]);

  // Get Order Token for Connect Web Socket
  useEffect(() => {
    if (!formIsValid) return;

    const data = {
      accountName: accountName.val,
      bankCode: bankCode.val,
      account: account.val,
    };

    if (process.env.REACT_APP_HOST_NAME === "88U") {
      setFormIsValid(false);

      Modal.alert({
        header: <img src={cautionImag} alt="注意" />,
        title: <p style={{ color: "#e38800", fontWeight: 400 }}>請注意</p>,
        showCloseButton: true,
        content: (
          <span>
            ATM轉帳時請註記持有人的
            <span style={{ color: "#007be4" }}>真實姓名</span>
            ，並顯示於雙方明細，資料不符時將不受理交易服務，並退還收款金額，相關手續費會於退款時一併扣除，謝謝。
          </span>
        ),
        confirmText: "確定",
        onConfirm: () => {
          dispatch(setBuyBankForm(data));
          confirmBuy(data);
        },
      });
      return;
    }

    confirmBuy(data);

    return setFormIsValid(false);

    // eslint-disable-next-line
  }, [formIsValid]);

  // Handle Form Input Change
  const onChange = ({ target }) => {
    setHttpError("");

    const { id, value } = target || {};

    if (id === "bank-form-name") {
      setAccountName({
        val: value.trim(),
        isValid: true,
        error: "",
      });
    }

    if (id === "bank-form-account") {
      setAccount({
        val: value.trim(),
        isValid: true,
        error: "",
      });
    }

    if (id === "bank-form-code") {
      setBankCode({
        val: value.trim(),
        isValid: true,
        error: "",
      });
    }
  };

  // Handle Key Up
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      validForm();
    }
  };

  // Valid Form
  const validForm = () => {
    const { usdt, rmb } = buyCount;
    setFormIsValid(true);

    if (accountName.val === "") {
      setAccountName({
        val: "",
        isValid: false,
        error: t("no_account_name"),
      });

      setFormIsValid(false);
    }

    if (process.env.REACT_APP_HOST_NAME === "88U") {
      if (account.val === "") {
        setAccount({
          val: "",
          isValid: false,
          error: t("no_bank_account"),
        });

        setFormIsValid(false);
      }

      if (bankCode.val === "") {
        setBankCode({
          val: "",
          isValid: false,
          error: t("no_bank_code"),
        });

        setFormIsValid(false);
      }
    }

    if (usdt <= 0 || usdt === "" || rmb <= 0 || rmb === "") {
      setErrorText(t("invalid_number"));
      setFormIsValid(false);
    }
  };

  return (
    <>
      <Form className="confirmBuyContent">
        <Form.Row className="justify-content-between align-items-start">
          <Form.Group
            as={Col}
            md={6}
            sm={12}
            className="mr-4 mt-0 d-flex flex-column justify-content-center px-0"
            // controlId="formBasicClientName"
          >
            <Form.Control
              id="bank-form-name"
              placeholder={t("account_name_placeholder")}
              onChange={onChange}
              value={accountName.val}
              className="confirmBuyInput easy-border"
              autoComplete="off"
              onKeyUp={handleKeyUp}
              isInvalid={accountName.error}
            />
            {/* 前端驗證錯誤訊息 */}
            {accountName.error && (
              <Form.Text
                style={{
                  fontSize: "12px",
                }}
                className=""
              >
                *{accountName.error}
              </Form.Text>
            )}

            {process.env.REACT_APP_HOST_NAME === "88U" && (
              <>
                <Form.Control
                  id="bank-form-account"
                  placeholder={t("account_placeholder")}
                  onChange={onChange}
                  value={account.val}
                  className="confirmBuyInput easy-border"
                  autoComplete="off"
                  onKeyUp={handleKeyUp}
                  isInvalid={account.error}
                  style={{ marginTop: "5px" }}
                />
                {account.error && (
                  <Form.Text
                    style={{
                      fontSize: "12px",
                    }}
                    className=""
                  >
                    *{account.error}
                  </Form.Text>
                )}

                <Form.Control
                  id="bank-form-code"
                  placeholder={t("bank_code_placeholder")}
                  onChange={onChange}
                  value={bankCode.val}
                  className="confirmBuyInput easy-border"
                  autoComplete="off"
                  onKeyUp={handleKeyUp}
                  isInvalid={bankCode.error}
                  style={{ marginTop: "5px" }}
                />
                {bankCode.error && (
                  <Form.Text
                    style={{
                      fontSize: "12px",
                      marginBottom: "5px",
                    }}
                    className=""
                  >
                    *{bankCode.error}
                  </Form.Text>
                )}
              </>
            )}

            {/* http 請求錯誤訊息 */}
            {errorText && (
              <Form.Text
                style={{
                  fontSize: "12px",
                }}
                className=""
              >
                *{errorText}
              </Form.Text>
            )}

            {/* 輸入提示 */}
            <p
              style={{
                color: "#eb0303",
                fontSize: 12,
              }}
              className=""
            >
              {t("account_name_prompt")}
            </p>
          </Form.Group>

          {/* 購買資訊 */}
          <Form.Group as={Col} className="">
            <Form.Row className="confirmBuy-textContent p-4">
              <Form.Group as={Col} className="mb-0">
                <div className="">
                  <p className="txt_12_grey mb-0">{t("buy_total")}</p>
                  <p className="confirmBuy-text c_blue mb-0">
                    {locationMoneyCalcWithThousand(Number(buyCount.rmb)).toString()}
                    &nbsp; {locationMoneyPrefix()}
                  </p>
                </div>
              </Form.Group>
              <Form.Group as={Col} className=" text-right mb-0">
                <p className="txt_12_grey mb-0">{t("buy_quantity")}</p>
                <p className="confirmBuy-text mb-0 text-dark">
                  {usdtThousandBitSeparator(Number(buyCount.usdt)).toString()}
                  &nbsp; USDT
                </p>
              </Form.Group>
            </Form.Row>
          </Form.Group>
        </Form.Row>

        <Form.Row className="justify-content-center mt-4">
          <Form.Group as={Col} className="mw400 px-0">
            <ButtonB
              className={
                buyBtnLoading ? "disable-easy-btn w-100" : "easy-btn w-100"
              }
              disabled={buyBtnLoading}
              onClick={validForm}
            >
              {buyBtnLoading ? (
                <>
                  <Spinner animation="grow" variant="danger" />
                  {t("btn_pairing")}
                </>
              ) : (
                t("btn_pair_start")
              )}
            </ButtonB>
          </Form.Group>
        </Form.Row>
      </Form>
    </>
  );
};

export default BankFrom;
