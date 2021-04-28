import { useContext, useEffect, useState } from 'react';
import HistoryContext from '../../context/history/HistoryContext';

import HistoryAllDetail from './HistoryAllDetail';

import Table from 'react-bootstrap/Table';

import downIcon from '../../Assets/i_usdt_down.png';
import redIcon from '../../Assets/i_usdt_red.png';
import blueIcon from '../../Assets/i_usdt_blue.png';
import purpleIcon from '../../Assets/i_usdt_purple.png';

import BaseSpinner from '../Ui/BaseSpinner';

const HistoryAll = () => {
  const historyContext = useContext(HistoryContext);
  const { getHistoryAll, allHistory, detailReq, singleDetail } = historyContext;

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

  if (allHistory.length) {
    return (
      <>
        <HistoryAllDetail show={show} singleDetail={singleDetail} onHide={() => setShow(false)} />
        <Table bordered hover className="mt-4">
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
                <tr onClick={() => handleClick(item.token)} style={{ cursor: 'pointer' }}>
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
                  <td
                    style={{
                      verticalAlign: 'middle',
                    }}
                  >
                    {item.Date}
                  </td>
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
                  <td
                    className="text-right pr-4"
                    style={{
                      verticalAlign: 'middle',
                    }}
                  >
                    {item.Balance.toFixed(2)}
                  </td>

                  <td
                    className="text-center"
                    style={{
                      verticalAlign: 'middle',
                      textAlign: 'center',
                    }}
                  >
                    <span className="fs_sm">完成</span>
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
  } else {
    return <BaseSpinner />;
  }
};

export default HistoryAll;
