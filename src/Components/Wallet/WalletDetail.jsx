import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import copy from 'copy-to-clipboard';

// Context
import WalletContext from '../../context/wallet/WalletContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';
import BalanceContext from '../../context/balance/BalanceContext';

// Lang Context
import { useI18n } from '../../lang';

// Components
import FromFooter from '../Layout/FormFooter';
import BaseSpinner from '../Ui/BaseSpinner';

const WalletDetail = () => {
  // Lang Context
  const { t } = useI18n();
  // Router Props
  const history = useHistory();

  // Wallet Context
  const walletContext = useContext(WalletContext);
  const { walletData, setWalletType, walletType } = walletContext;

  // Balance Context
  const balanceContext = useContext(BalanceContext);
  const { avb, real, getBalance } = balanceContext;

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { httpLoading, errorText, setHttpError } = httpErrorContext;

  useEffect(() => {
    if (!walletData) history.replace('/home');
    return () => {
      setWalletType('');
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (errorText) alert(errorText);
    return () => {
      setHttpError('');
    };
    // eslint-disable-next-line
  }, [errorText]);

  useEffect(() => {
    if (!avb || !real) getBalance();
    // eslint-disable-next-line
  }, [avb, real]);

  const handleClick = () => {
    history.replace('/home/wallet');
  };

  const handleCopy = value => {
    copy(value);

    if (copy(value)) {
      alert(t('btn_copy'));
    } else {
      alert(t('btn_copy_fail'));
    }
  };
  return (
    <section className="wallet">
      <div className="container h_88">
        <div className="row">
          <div className="col-12">
            <p className="welcome_txt pl-0">{t('welcome_text')}</p>
            <div className="content-box">
              {httpLoading ? (
                <div style={{ margin: '15rem' }}>
                  <BaseSpinner />
                </div>
              ) : !httpLoading && walletData ? (
                <div className="" style={{ paddingLeft: 30 }}>
                  {/* text */}

                  {/* image */}
                  <div className="row">
                    {/* COl */}
                    <div className="txt18 pt_20 col-12 pl-0 mb-4">{walletType === 'trc20' ? 'TRC20' : 'ERC20'}</div>

                    {/* Col */}
                    <div className="col-md-3 col-12 center_p20" style={{ backgroundColor: '#1f7eff', marginBottom: 40 }}>
                      {walletType === 'trc20' ? (
                        <img
                          className="qrCode-img"
                          src={`data:image/png;base64,${walletData.Qr_img2}`}
                          alt="qr code"
                          style={{
                            fill: 'red',
                          }}
                        ></img>
                      ) : (
                        <img className="qrCode-img" src={`data:image/png;base64,${walletData.Qr_img}`} alt="qr code"></img>
                      )}
                    </div>

                    {/* Col */}
                    <div className="col-md-8 col-12">
                      <div className="walletAddress-box">
                        <span className="easy_link">{walletType === 'trc20' ? walletData.WalletAddress2 : walletData.WalletAddress}</span>
                        {walletType === 'trc20' ? (
                          <div className="i_copy2" onClick={() => handleCopy(walletData.WalletAddress2)}></div>
                        ) : (
                          <div className="i_copy2" onClick={() => handleCopy(walletData.WalletAddress)}></div>
                        )}
                      </div>
                      <div className="pt_20">
                        <div className="balance">
                          {t('balance_real')}：<span className="usdt mr_sm"></span>
                          <span className="c_green mr_sm">USDT</span>
                          <span className="c_green fs_20">{real}</span>
                        </div>
                      </div>
                      <div>
                        <div className="balance">
                          {t('balance_avb')}：<span className="usdt mr_sm"></span>
                          <span className="c_green mr_sm">USDT</span>
                          <span className="c_green fs_20">{avb}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="row mt-4">
                    <div className="col-12 text-center">
                      <button onClick={handleClick} className="easy-btn mw400">
                        {t('btn_return')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2>{t('no_data_2')}</h2>
                  <div className="row">
                    <div className="col-12">
                      <button onClick={handleClick} className="easy-btn">
                        {t('btn_return')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <FromFooter />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WalletDetail;
