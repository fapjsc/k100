import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Context
import WalletContext from '../../context/wallet/WalletContext';

// Components
import FromFooter from '../Layout/FormFooter';

// Style
import './index.scss';

const TheWallet = () => {
  // Router Props
  const history = useHistory();

  // Wallet Context
  const walletContext = useContext(WalletContext);
  const { getQrCode, setWalletType } = walletContext;

  useEffect(() => {
    getQrCode();
    // eslint-disable-next-line
  }, []);

  const handleClick = type => {
    setWalletType(type);
    history.push(`/home/wallet/${type}`);
  };

  return (
    <section className="wallet bg_grey">
      <div className="container h_88">
        <div className="row">
          <div className="col-12">
            <p className="welcome_txt pl-0 mt-4">歡迎登入</p>
            <div className="content-box" style={{ paddingLeft: 30 }}>
              {/* Balance */}
              <div className="row">
                <div className="col-md-8 col-12">
                  <p className="txt_12 mb-0">我的錢包</p>
                  <div className="balance">
                    結餘：
                    <span className="usdt mr_sm"></span>
                    <span className="c_green mr_sm">USDT</span>
                    <span className="c_green fs_20">888</span>
                  </div>

                  <div className="balance">
                    可提：
                    <span className="usdt mr_sm"></span>
                    <span className="c_green mr_sm">USDT</span>
                    <span className="c_green fs_20">1234</span>
                  </div>
                </div>
              </div>
              <br />
              {/* Wallet chose button */}
              <div className="row">
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

              <FromFooter />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheWallet;
