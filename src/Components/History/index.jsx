import { useState, useContext, useEffect } from 'react';
import { Switch, Route, Link, Redirect, useHistory, useLocation } from 'react-router-dom';

// Context
import HistoryContext from '../../context/history/HistoryContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components

import HistoryAll from './HistoryAll';
import HistoryWait from './HistoryWait';
// import HistoryAll from '../HistoryV2/HistoryAll';
// import HistoryWait from '../HistoryV2/HistoryWait';

// Style
import style from './History.module.scss';
import './index.scss';
// import Badge from 'react-bootstrap/Badge';

const History = () => {
  // History Context
  const historyContext = useContext(HistoryContext);
  const { setWaitList, waitList } = historyContext;

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  // Router Props
  const history = useHistory();
  const location = useLocation();

  // Init State
  const [historyState, setHistoryState] = useState('all');

  // ===========
  // useEffect
  // ===========
  useEffect(() => {
    history.push(`/home/history/${historyState}`);
    setWaitList();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (errorText) alert(errorText);
    return () => {
      setHttpError('');
    };
    // eslint-disable-next-line
  }, [errorText]);

  return (
    <section className={style.section}>
      <div className="row">
        <div className="col-12">
          <div className="contentbox" style={{ marginTop: 60, maxWidth: 1140 }}>
            <div className="history-tab">
              <Link
                to="/home/history/all"
                className={
                  location.pathname.includes('/home/history/all')
                    ? 'history-link history-link-active'
                    : 'history-link'
                }
                onClick={() => setHistoryState('all')}
              >
                所有紀錄
              </Link>

              <div style={waitBox}>
                <Link
                  to="/home/history/wait"
                  className={
                    location.pathname.includes('/home/history/wait')
                      ? 'history-link history-link-active'
                      : 'history-link'
                  }
                  onClick={() => setHistoryState('wait')}
                >
                  待處理
                </Link>
                {waitList.length > 0 && (
                  // <Badge pill variant="danger" style={waitCount}>
                  //   {waitList.length}
                  // </Badge>

                  <span style={waitCount}>{waitList.length}</span>
                )}
              </div>
            </div>

            <Switch>
              <Route path="/home/history/all" component={HistoryAll}></Route>
              <Route path="/home/history/wait" component={HistoryWait}></Route>
              <Redirect to="/home/history/all" />
            </Switch>
          </div>
        </div>
      </div>
    </section>
  );
};

const waitBox = {
  position: 'relative',
};

const waitCount = {
  position: 'absolute',
  top: -10,
  right: 13,
  borderRadius: '50%',
  height: '20px',
  width: '20px',
  backgroundColor: 'red',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
};

const linkStyle = {
  backgroundColor: 'inherit',
  borderBottom: 'none',
  outline: 'none',
  cursor: 'pointer',
  padding: '14px 16px',
  fontSize: '17px',
  color: '#707070',

  marginRight: '1rem',

  display: 'inline-block',
  width: '10rem',
  textAlign: 'center',
};

const linkActive = {
  backgroundColor: 'inherit',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  padding: '14px 16px',
  fontSize: '17px',

  color: '#3f80fa',
  borderBottom: '2px solid #3f80fa',

  marginRight: '1rem',
  display: 'inline-block',
  width: '10rem',
  textAlign: 'center',
};
export default History;
