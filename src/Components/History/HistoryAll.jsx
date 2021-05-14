import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMediaQuery } from 'react-responsive';

// Context
import HistoryContext from '../../context/history/HistoryContext';

// Components
import HistoryAllDetail from './HistoryAllDetail';
import BaseSpinner from '../Ui/BaseSpinner';
import NoData from '../NoData/';

// Style
import Table from 'react-bootstrap/Table';
// import Button from 'react-bootstrap/Button';
import downIcon from '../../Assets/i_usdt_down.png';
import redIcon from '../../Assets/i_usdt_red.png';
import blueIcon from '../../Assets/i_usdt_blue.png';
import purpleIcon from '../../Assets/i_usdt_purple.png';

const HistoryAll = () => {
  // Media Query
  const isMobile = useMediaQuery({ query: '(max-width: 610px)' }); // 大於610px => false

  // History Context
  const historyContext = useContext(HistoryContext);
  const { getHistoryAll, allHistory, detailReq, singleDetail, historyLoading } = historyContext;

  // Init State
  const [show, setShow] = useState(false);

  useEffect(() => {
    getHistoryAll();

    // eslint-disable-next-line
  }, []);

  const handleClick = token => {
    if (token) {
      detailReq(token);
      setShow(true);
    } else {
      alert('沒有Token');
    }
  };

  if (allHistory.length && !historyLoading) {
    return (
      <>
        {singleDetail && <HistoryAllDetail show={show} onHide={() => setShow(false)} />}
        {/* <Button onClick={() => buyWsClient.close()}>test</Button> */}
        <Table responsive bordered hover className="mt-4">
          <thead>
            <tr>
              <th></th>
              <th className="theadTh">日期</th>
              <th className="theadTh">交易額（USDT）</th>
              <th className="theadTh">結餘（USDT）</th>
              <th className="theadTh">狀態</th>
            </tr>
          </thead>
          <tbody>
            {allHistory.map(item => {
              return (
                <tr
                  key={uuidv4()}
                  onClick={() => handleClick(item.token)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* 交易類別 */}
                  {!isMobile ? (
                    // - 桌面
                    <td
                      style={{
                        maxWidth: 70,
                        textAlign: 'center',
                        fontWeight: 300,
                      }}
                      className={
                        item.MasterType === 0
                          ? 'txt18'
                          : item.MasterType === 1
                          ? 'txt18_r'
                          : 'txt18_p'
                      }
                    >
                      <img
                        src={
                          item.MasterType === 0
                            ? blueIcon
                            : item.MasterType === 1
                            ? redIcon
                            : purpleIcon
                        }
                        alt="status icon"
                        style={{
                          height: 21,
                          marginBottom: 3,
                          marginRight: 8,
                        }}
                      />
                      <span className="" style={{ letterSpacing: 1.5, fontSize: 17 }}>
                        {item.MasterType === 0
                          ? '買入'
                          : item.MasterType === 1
                          ? '賣出'
                          : item.MasterType === 2
                          ? '轉出'
                          : '轉入'}
                      </span>
                    </td>
                  ) : (
                    // - 手機
                    <td
                      style={{
                        maxWidth: 200,
                        textAlign: 'center',
                        fontWeight: 300,
                        position: 'relative',
                      }}
                      className={
                        item.MasterType === 0
                          ? 'txt14_b '
                          : item.MasterType === 1
                          ? 'txt14_r'
                          : 'txt14_p '
                      }
                    >
                      {/* <img
                        src={
                          item.MasterType === 0
                            ? blueIcon
                            : item.MasterType === 1
                            ? redIcon
                            : purpleIcon
                        }
                        alt="status icon"
                        style={{
                          height: 10,
                          position: 'absolute',
                          top: 2,
                          left: 7,
                        }}
                      /> */}
                      <span className="">
                        {item.MasterType === 0
                          ? '買入'
                          : item.MasterType === 1
                          ? '賣出'
                          : item.MasterType === 2
                          ? '轉出'
                          : '轉入'}
                      </span>
                    </td>
                  )}

                  {/* 日期 */}
                  <td
                    style={{
                      verticalAlign: 'middle',
                    }}
                  >
                    {item.Date}
                  </td>
                  {/* 交易額 */}
                  <td
                    style={{
                      verticalAlign: 'middle',
                    }}
                    className={
                      item.MasterType === 0 || item.MasterType === 3
                        ? 'c_green text-right pr-4'
                        : 'c_red text-right pr-4'
                    }
                  >
                    {item.UsdtAmt.toFixed(2)}
                  </td>

                  {/* 餘額 */}
                  <td
                    className="text-right pr-4"
                    style={{
                      verticalAlign: 'middle',
                    }}
                  >
                    {item.Balance.toFixed(2)}
                  </td>

                  {/* 狀態 */}
                  <td
                    className="text-center"
                    style={{
                      verticalAlign: 'middle',
                      textAlign: 'center',
                    }}
                  >
                    <span className={isMobile ? 'fs_ssm' : 'fs_sm'}>完成</span>
                    <img
                      className=""
                      src={downIcon}
                      alt="done icon"
                      style={{
                        width: 13,
                        marginLeft: 5,
                        marginBottom: 3,
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  } else if (!allHistory.length && !historyLoading) {
    return <NoData />;
  } else {
    return <BaseSpinner />;
  }
};

export default HistoryAll;
