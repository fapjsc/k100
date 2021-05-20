import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useMediaQuery } from 'react-responsive';

// Context
import HistoryContext from '../../context/history/HistoryContext';

// Components
import NoData from '../NoData';
import BaseSpinner from '../Ui/BaseSpinner';

// Style
import Table from 'react-bootstrap/Table';
import redIcon from '../../Assets/i_usdt_red.png';
import blueIcon from '../../Assets/i_usdt_blue.png';
import purpleIcon from '../../Assets/i_usdt_purple.png';

const HistoryWait = () => {
  // Media Query
  const isMobile = useMediaQuery({ query: '(max-width: 610px)' }); // 大於610px => false

  // Router props
  const history = useHistory();

  // History Context
  const historyContext = useContext(HistoryContext);
  const { waitList, setWaitList, historyLoading } = historyContext;

  useEffect(() => {
    setWaitList();

    // eslint-disable-next-line
  }, []);

  const handleClick = orderToken => {
    const item = waitList.find(el => el.token === orderToken);

    console.log(item);

    if (item.MasterType === '買入') {
      history.push(`/home/transaction/buy/${orderToken}`);
    }

    if (item.MasterType === '轉出') {
      history.push(`/home/transaction/transfer/${orderToken}`);
    }

    if (item.MasterType === '賣出') {
      history.push(`/home/transaction/sell/${orderToken}`);
    }
  };

  if (!historyLoading && waitList.length) {
    return (
      <Table responsive bordered hover className="mt-4">
        <thead>
          <tr>
            <th style={titleStyle} className="w8"></th>
            <th style={titleStyle} className="w55">
              日期
            </th>
            <th style={titleStyle} className="mw105">
              交易額（USDT
            </th>
            <th style={titleStyle} className="w8">
              狀態
            </th>
          </tr>
        </thead>

        <tbody>
          {waitList.map(h => (
            <tr key={uuidv4()} onClick={() => handleClick(h.token)} style={{ cursor: 'pointer' }}>
              {/* 交易類別 */}
              <td
                className={
                  h.MasterType === '買入'
                    ? 'txt18 text-center'
                    : h.MasterType === '賣出'
                    ? 'txt18_r text-center'
                    : 'txt18_p text-center'
                }
              >
                <img
                  style={iconStyle}
                  src={
                    h.MasterType === '買入'
                      ? blueIcon
                      : h.MasterType === '賣出'
                      ? redIcon
                      : purpleIcon
                  }
                  alt="status icon"
                />
                <span style={textStyle}>{h.MasterType}</span>
              </td>

              {/* 日期 */}
              <td className="" style={dateText}>
                {h.Date}
              </td>

              {/* 交易額 */}
              <td
                style={transactionAmount}
                className={
                  h.MasterType === '買入' || h.MasterType === '轉入'
                    ? 'c_green text-right pr-4'
                    : 'c_red text-right pr-4'
                }
              >
                {h.UsdtAmt.toFixed(2)}
              </td>

              {/* 狀態 */}
              <td className="text-center" style={statusStyle}>
                {h.Order_StatusID === 34
                  ? '收款確認中'
                  : h.Order_StatusID === 33
                  ? '等待付款'
                  : h.Order_StatusID === 0 || h.Order_StatusID === 31
                  ? '執行中'
                  : null}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  } else if (!historyLoading && !waitList.length) {
    return <NoData />;
  } else {
    return <BaseSpinner />;
  }
};

const iconStyle = {
  height: 15,
  width: 15,
  marginRight: 4,
};

const titleStyle = {
  fontSize: 12,
  lineHeight: 1.4,
  color: '#646464',
  fontWeight: 'normal',
  verticalAlign: 'middle',
};

const textStyle = {
  fontSize: '14px',
  lineHeight: '1.7',
};

const dateText = {
  fontSize: 12,
  lineHeight: 1.4,
  color: '#000',
  verticalAlign: 'middle',
};

const transactionAmount = {
  fontSize: 12,
  lineHeight: 1.4,
  verticalAlign: 'middle',
};

const statusStyle = {
  fontSize: 12,
  lineHeight: 1.4,
  verticalAlign: 'middle',
};

export default HistoryWait;
