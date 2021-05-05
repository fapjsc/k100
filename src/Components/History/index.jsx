import { useState, useContext, useEffect } from 'react';
import { Switch, Route, Link, Redirect, useHistory, useLocation } from 'react-router-dom';

// Context
import HistoryContext from '../../context/history/HistoryContext';

// Components
import All from './All'; // 舊版
import Wait from './Wait'; // 舊版
import HistoryAll from './HistoryAll'; // 修正中
import HistoryWait from './HistoryWait'; // 修正中

// Style
import style from './History.module.scss';
import './index.scss';
import Badge from 'react-bootstrap/Badge';

const History = () => {
  // History Context
  const historyContext = useContext(HistoryContext);
  const { setWaitList, waitList } = historyContext;

  // Router Props
  const history = useHistory();
  const location = useLocation();

  // Init State
  const [historyState, setHistoryState] = useState('all');

  useEffect(() => {
    history.push(`/home/history/${historyState}`);
    setWaitList();

    // eslint-disable-next-line
  }, []);

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
                  <Badge pill variant="danger" style={waitCount}>
                    {waitList.length}
                  </Badge>
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
  top: -8,
  right: 13,
};

export default History;
