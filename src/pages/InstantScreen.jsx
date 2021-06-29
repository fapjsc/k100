import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Context
import InstantContext from '../context/instant/InstantContext';

// Components
import InstantCount from '../Components/Instant/InstantCount';
import FormFooter from '../Components/Layout/FormFooter';
import Pairing from '../Components/universal/Pairing';
import InstantNav from '../Components/Instant/InstantNav';

const InstantScreen = () => {
  // Router Props
  const history = useHistory();

  // Init State
  const [showPop, setShowPop] = useState(false);
  const [tab, setTab] = useState('all');

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { countData, setSell1Data, setCountData, setBuy1Data, sell1Data, buy1Data, actionType, setActionType } = instantContext;

  // ===========
  //  UseEffect
  // ===========
  useEffect(() => {
    return () => {
      setActionType('');
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (buy1Data) history.replace(`/home/instant/sell/${countData.token}`); // 對方是buy,即時交易這方是sell
    if (sell1Data) history.replace(`/home/instant/buy/${countData.token}`);
    // if (!buy1Data && !sell1Data) history.replace('/home');
    // eslint-disable-next-line
  }, [sell1Data, buy1Data]);

  // ==========
  //  Function
  // ==========
  const handleClosePop = () => {
    history.replace('/home/overview');
    setSell1Data(null);
    setCountData(null);
    setBuy1Data(null);
  };

  return (
    <>
      <Pairing show={showPop} onHide={handleClosePop} />
      <section className="container h_88">
        <div className="row">
          <div className="col-12">
            <p className="welcome_txt pl-0 mt-4">歡迎登入</p>
            <div className="contentbox">
              <InstantNav tab={tab} setTab={setTab} jumpTo={true} />
              {actionType !== 'onGoing' && <InstantCount setShowPop={setShowPop} showPop={showPop} />}
              <FormFooter />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstantScreen;
