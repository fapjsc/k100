import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Context
import HistoryContext from '../../context/history/HistoryContext';

// Lang Context
import { useI18n } from '../../lang';

// Style
import redIcon from '../../Assets/i_usdt_red.png';
import blueIcon from '../../Assets/i_usdt_blue.png';
import purpleIcon from '../../Assets/i_usdt_purple.png';

const HistoryPaginate = ({ pageNumber, handleClick }) => {
  const dataPerPage = 15;
  const pagesVisited = pageNumber * dataPerPage;

  // Lang Context
  const { t } = useI18n();

  // History Context
  const historyContext = useContext(HistoryContext);
  const { allHistory } = historyContext;

  return allHistory.slice(pagesVisited, pagesVisited + dataPerPage).map(item => {
    return (
      <tr key={uuidv4()} onClick={() => handleClick(item.token, item.Balance.toFixed(2))} style={{ cursor: 'pointer' }}>
        {/* 交易類別 */}
        <td className={item.MasterType === 0 ? 'txt18 text-center' : item.MasterType === 1 ? 'txt18_r text-center' : 'txt18_p text-center'}>
          <img style={iconStyle} src={item.MasterType === 0 ? blueIcon : item.MasterType === 1 ? redIcon : purpleIcon} alt="status icon" />
          <span className="" style={textStyle}>
            {item.MasterType === 0 ? t('history_buy') : item.MasterType === 1 ? t('history_sell') : item.MasterType === 2 ? t('history_transfer_out') : t('history_transfer_in')}
          </span>
        </td>

        {/* 日期 */}
        <td style={dateText}>{item.Date}</td>

        {/* 交易額 */}
        <td style={transactionAmount} className={item.MasterType === 0 || item.MasterType === 3 ? 'c_green text-right pr-4' : 'c_red text-right pr-4'}>
          {item.UsdtAmt.toFixed(2)}
        </td>

        {/* 餘額 */}
        <td style={avbStyle} className="text-right pr-4">
          {item.Balance.toFixed(2)}
        </td>

        {/* 狀態 */}
        <td style={statusStyle} className="text-center">
          <span className="mr-2">{t('history_transaction_complete')}</span>
          <div className="i_down" />
        </td>
      </tr>
    );
  });
};

const iconStyle = {
  height: 15,
  width: 15,
  marginRight: 4,
};

const textStyle = {
  fontSize: '14px',
  lineHeight: '1.7',
};

const dateText = {
  fontSize: 11,
  lineHeight: 1.4,
  color: '#000',
  verticalAlign: 'middle',
};

const transactionAmount = {
  fontSize: 12,
  lineHeight: 1.4,
  verticalAlign: 'middle',
};

const avbStyle = {
  fontSize: 12,
  lineHeight: 1.4,
  verticalAlign: 'middle',
};

const statusStyle = {
  fontSize: 12,
  lineHeight: 1.4,
  verticalAlign: 'middle',
};

export default HistoryPaginate;
