import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import copy from 'copy-to-clipboard';

// Context
import WalletContext from '../../context/wallet/WalletContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import FromFooter from '../Layout/FormFooter';
import BaseSpinner from '../Ui/BaseSpinner';

const WalletDetail = () => {
  // Router Props
  const history = useHistory();

  // Wallet Context
  const walletContext = useContext(WalletContext);
  const { walletData, setWalletType, walletType, getQrCode } = walletContext;

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { httpLoading } = httpErrorContext;

  useEffect(() => {
    getQrCode();
    return () => {
      setWalletType('');
    };
    // eslint-disable-next-line
  }, []);

  const handleClick = () => {
    history.replace('/home/wallet');
  };

  const handleCopy = value => {
    copy(value);

    if (copy(value)) {
      alert('複製成功');
    } else {
      alert('複製失敗，請手動複製');
    }
  };
  return (
    <section className="wallet bg_grey">
      <div className="container h_88">
        <div className="row">
          <div className="col-12">
            <p className="welcome_txt pl-0">歡迎登入</p>
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
                    <div className="txt18 pt_20 col-12 pl-0 mb-4">
                      {walletType === 'trc20' ? 'TRC20' : 'ERC20'}
                    </div>

                    {/* Col */}
                    <div
                      className="col-md-3 col-12 center_p20"
                      style={{ backgroundColor: '#1f7eff', marginBottom: 40 }}
                    >
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
                        <img
                          className="qrCode-img"
                          src={`data:image/png;base64,${walletData.Qr_img}`}
                          alt="qr code"
                        ></img>
                      )}
                    </div>

                    {/* Col */}
                    <div className="col-md-8 col-12">
                      <div className="walletAddress-box">
                        <span className="easy_link">
                          {walletType === 'trc20'
                            ? walletData.WalletAddress2
                            : walletData.WalletAddress}
                        </span>
                        {walletType === 'trc20' ? (
                          <div
                            className="i_copy2"
                            onClick={() => handleCopy(walletData.WalletAddress2)}
                          ></div>
                        ) : (
                          <div
                            className="i_copy2"
                            onClick={() => handleCopy(walletData.WalletAddress)}
                          ></div>
                        )}
                      </div>
                      <div className="pt_20">
                        <div className="balance">
                          結餘：
                          <span className="usdt mr_sm"></span>
                          <span className="c_green mr_sm">USDT</span>
                          <span className="c_green fs_20">1234</span>
                        </div>
                      </div>
                      <div>
                        <div className="balance">
                          可提：
                          <span className="usdt mr_sm"></span>
                          <span className="c_green mr_sm">USDT</span>
                          <span className="c_green fs_20">1234</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="row mt-4">
                    <div className="col-12 text-center">
                      <button onClick={handleClick} className="easy-btn mw400">
                        返回
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2>沒有數據</h2>
                  <div className="row">
                    <div className="col-12">
                      <button onClick={handleClick} className="easy-btn">
                        返回
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
