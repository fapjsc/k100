import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

// Context
import WalletContext from "../../context/wallet/WalletContext";
import BalanceContext from "../../context/balance/BalanceContext";
import HttpErrorContext from "../../context/httpError/HttpErrorContext";

// Lang Context
import { useI18n } from "../../lang";

// Components
import FromFooter from "../Layout/FormFooter";
import BaseSpinner from "../Ui/BaseSpinner";
import EditBankInfoForm from "./acc-edit/EditBankInfoForm";

// Actions
import { getAcc, getAccHistory } from "../../store/actions/accountAction";

// Apis

// BootStrap
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";

// Icons
import { AiFillEdit } from "react-icons/ai";

// Style
import "./index.scss";

const TheWallet = () => {
  // Init State
  const [showFom, setShowForm] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const {
    loading: accLoading,
    data: accData,
    // error: accError,
  } = useSelector((state) => state.currentAcc);

  const {
    // loading: historyAccLoading,
    data: historyAccData,
    // error: historyAccError,
  } = useSelector((state) => state.historyAcc);

  // Lang Context
  const { t } = useI18n();

  // Router Props
  const history = useHistory();

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { httpLoading, errorText, setHttpError } = httpErrorContext;

  // Wallet Context
  const walletContext = useContext(WalletContext);
  const { getQrCode, setWalletType, walletData } = walletContext;

  // Balance Context
  const balanceContext = useContext(BalanceContext);
  const { avb, real, getBalance } = balanceContext;

  useEffect(() => {
    if (!avb || !real) getBalance();
    if (!walletData) getQrCode();

    // eslint-disable-next-line
  }, [avb, real, walletData]);

  useEffect(() => {
    if (errorText) alert(errorText);
    return () => {
      setHttpError("");
    };
    // eslint-disable-next-line
  }, [errorText]);

  useEffect(() => {
    dispatch(getAcc());
    dispatch(getAccHistory());
    // eslint-disable-next-line
  }, []);

  const handleClick = (type) => {
    setWalletType(type);
    history.push(`/home/wallet/${type}`);
  };

  return (
    <section className="wallet">
      <div className="container h_88">
        <div className="row">
          <div className="col-12">
            <p className="welcome_txt pl-0 mt-3">{t("welcome_text")}</p>
            <div className="content-box" style={{ paddingLeft: 30 }}>
              {/* Balance */}

              {httpLoading ? (
                <div style={{ margin: 50 }}>
                  <BaseSpinner />
                </div>
              ) : (
                <>
                  <div className="row mt-4">
                    <div className="col-md-8 col-12">
                      <p className="txt_12 mb-0">{t("overView_wallet")}</p>
                      <div className="balance">
                        {t("balance_real")}：
                        <span className="usdt mr_sm"></span>
                        <span className="c_green mr_sm">USDT</span>
                        <span className="c_green fs_20">{real}</span>
                      </div>

                      <div className="balance">
                        {t("balance_avb")}：<span className="usdt mr_sm"></span>
                        <span className="c_green mr_sm">USDT</span>
                        <span className="c_green fs_20">{avb}</span>
                      </div>
                    </div>
                  </div>
                  <br />
                  <br />

                  {/* Wallet chose button */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <p className="txt_12">{t("wallet_address")}</p>
                    </div>
                    <div className="col-md-6 col-12 text-center">
                      <button
                        onClick={() => handleClick("trc20")}
                        className="easy-btn w-75"
                      >
                        TRC20
                      </button>
                    </div>

                    <div className="col-md-6 col-12 text-center">
                      <button
                        onClick={() => handleClick("erc20")}
                        className="easy-btn w-75"
                      >
                        ERC20
                      </button>
                    </div>
                  </div>

                  <br />
                  <br />

                  {/* Acc data */}
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="txt_12">
                          {t("EditBankInfoForm_account_info")}
                        </p>
                        <AiFillEdit
                          style={{
                            fontSize: "2rem",
                            color: "#242e47",
                            cursor: "pointer",
                          }}
                          onClick={() => setShowForm((preState) => !preState)}
                        />
                      </div>

                      {accData && (
                        <>
                          <ListGroup>
                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                              {t("EditBankInfoForm_name")}：{accData.P2}
                            </ListGroup.Item>

                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                              {t("EditBankInfoForm_account")}：{accData.P1}
                            </ListGroup.Item>

                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                              {t("EditBankInfoForm_bank")}：{accData.P3}
                            </ListGroup.Item>

                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                              {t("EditBankInfoForm_city")}：{accData.P4}
                            </ListGroup.Item>
                          </ListGroup>

                          <EditBankInfoForm
                            accHistoryData={historyAccData}
                            show={showFom}
                            onHide={() => setShowForm(false)}
                          />
                        </>
                      )}

                      {accLoading && (
                        <div
                          className=""
                          style={{
                            height: "5rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Spinner
                            animation="border"
                            style={{ width: "3rem", height: "3rem" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <FromFooter />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheWallet;
