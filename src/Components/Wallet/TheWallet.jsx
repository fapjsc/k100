import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Context
import WalletContext from '../../context/wallet/WalletContext';
import BalanceContext from '../../context/balance/BalanceContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import FromFooter from '../Layout/FormFooter';
import BaseSpinner from '../Ui/BaseSpinner';

// Style
import './index.scss';

const TheWallet = () => {
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
      setHttpError('');
    };
    // eslint-disable-next-line
  }, [errorText]);

  const handleClick = type => {
    setWalletType(type);
    history.push(`/home/wallet/${type}`);
  };

  return (
    <section className="wallet">
      <div className="container h_88">
        <div className="row">
          <div className="col-12">
            <p className="welcome_txt pl-0 mt-3">歡迎登入</p>
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
                      <p className="txt_12 mb-0">我的錢包</p>
                      <div className="balance">
                        結餘：
                        <span className="usdt mr_sm"></span>
                        <span className="c_green mr_sm">USDT</span>
                        <span className="c_green fs_20">{real}</span>
                      </div>

                      <div className="balance">
                        可提：
                        <span className="usdt mr_sm"></span>
                        <span className="c_green mr_sm">USDT</span>
                        <span className="c_green fs_20">{avb}</span>
                      </div>
                    </div>
                  </div>
                  <br />
                  {/* Wallet chose button */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <p className="txt_12">充值地址</p>
                    </div>
                    <div className="col-md-6 col-12 text-center">
                      <button onClick={() => handleClick('trc20')} className="easy-btn w-75">
                        TRC20
                      </button>
                    </div>

                    <div className="col-md-6 col-12 text-center">
                      <button onClick={() => handleClick('erc20')} className="easy-btn w-75">
                        ERC20
                      </button>
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
