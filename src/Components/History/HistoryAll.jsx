import { useContext, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
// import { v4 as uuidv4 } from 'uuid';
// import { useMediaQuery } from 'react-responsive';

// Context
import HistoryContext from '../../context/history/HistoryContext';

// Components
import HistoryAllDetail from './HistoryAllDetail';
import BaseSpinner from '../Ui/BaseSpinner';
import NoData from '../NoData/';
import HistoryPaginate from './HistoryPaginate';

// Style
import Table from 'react-bootstrap/Table';
// import Button from 'react-bootstrap/Button';
// import downIcon from '../../Assets/i_usdt_down.png';
// import redIcon from '../../Assets/i_usdt_red.png';
// import blueIcon from '../../Assets/i_usdt_blue.png';
// import purpleIcon from '../../Assets/i_usdt_purple.png';
// import Pagination from 'react-bootstrap/Pagination';

const HistoryAll = () => {
  // Media Query
  // const isMobile = useMediaQuery({ query: '(max-width: 610px)' }); // 大於610px => false

  // Router Props
  const history = useHistory();
  const match = useRouteMatch();
  // History Context
  const historyContext = useContext(HistoryContext);
  const { getHistoryAll, allHistory, detailReq, singleDetail, historyLoading } = historyContext;

  // Init State
  const [show, setShow] = useState(false);
  const [balance, setBalance] = useState(null);
  const [pageCount, setPageCount] = useState(0); //總共多少頁
  const [pageNumber, setPageNumber] = useState(0); //當前選擇的頁數

  useEffect(() => {
    getHistoryAll();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (allHistory.length > 0) {
      let num = Math.ceil(allHistory.length / 15);
      setPageCount(num);
    }
  }, [allHistory]);

  const handleClick = (token, balance) => {
    if (token) {
      setBalance(balance);
      detailReq(token);
      setShow(true);
    } else {
      alert('沒有Token');
    }
  };

  const changePage = ({ selected }) => {
    history.push(pageNumber);
    setPageNumber(selected);
  };

  if (allHistory.length && !historyLoading) {
    return (
      <>
        {singleDetail && (
          <HistoryAllDetail
            show={show}
            onHide={() => setShow(false)}
            balance={balance && balance}
          />
        )}
        <Table responsive bordered hover className="mt-4">
          <thead>
            <tr>
              <th style={titleStyle} className="w8"></th>
              <th style={titleStyle} className="w55">
                日期
              </th>
              <th style={titleStyle} className="mw105">
                交易額（USDT）
              </th>
              <th style={titleStyle} className="mw105">
                結餘（USDT）
              </th>
              <th style={titleStyle} className="w8">
                狀態
              </th>
            </tr>
          </thead>
          <tbody>
            <HistoryPaginate pageNumber={pageNumber} handleClick={handleClick} />
          </tbody>
        </Table>

        <div className="d-flex justify-content-center py-4 mt-4">
          <ReactPaginate
            previousLabel={'上一頁'}
            nextLabel={'下一頁'}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={'paginationBtn'}
            previousLinkClassName={'previousBtn'}
            nextLinkClassName={'nextBtn'}
            disabledClassName={'paginationDisabled'}
            activeClassName={'paginationActive'}
            initialPage={pageNumber}
          />
        </div>
      </>
    );
  } else if (!allHistory.length && !historyLoading) {
    return <NoData />;
  } else {
    return (
      <div style={{ margin: '30px auto' }}>
        <BaseSpinner />
      </div>
    );
  }
};

// const iconStyle = {
//   height: 15,
//   width: 15,
//   marginRight: 4,
// };

const titleStyle = {
  fontSize: 12,
  lineHeight: 1.4,
  color: '#646464',
  fontWeight: 'normal',
  verticalAlign: 'middle',
};

// const textStyle = {
//   fontSize: '14px',
//   lineHeight: '1.7',
// };

// const dateText = {
//   fontSize: 11,
//   lineHeight: 1.4,
//   color: '#000',
//   verticalAlign: 'middle',
// };

// const transactionAmount = {
//   fontSize: 12,
//   lineHeight: 1.4,
//   verticalAlign: 'middle',
// };

// const avbStyle = {
//   fontSize: 12,
//   lineHeight: 1.4,
//   verticalAlign: 'middle',
// };

// const statusStyle = {
//   fontSize: 12,
//   lineHeight: 1.4,
//   verticalAlign: 'middle',
// };

export default HistoryAll;
