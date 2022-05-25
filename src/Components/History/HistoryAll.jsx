import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";

// Context
import HistoryContext from "../../context/history/HistoryContext";

// Lang Context
import { useI18n } from "../../lang";

// Components
import HistoryAllDetail from "./HistoryAllDetail";
import BaseSpinner from "../Ui/BaseSpinner";
import NoData from "../NoData/";
import HistoryPaginate from "./HistoryPaginate";

// Style
import Table from "react-bootstrap/Table";

const HistoryAll = () => {
  // Lang Context
  const { t } = useI18n();

  // Router Props
  const history = useHistory();
  // History Context
  const historyContext = useContext(HistoryContext);
  const { getHistoryAll, allHistory, detailReq, singleDetail, historyLoading } =
    historyContext;

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
      alert(t("no_token"));
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
                {t("history_date")}
              </th>
              <th style={titleStyle} className="mw105">
                {t("history_transaction_deal")}
              </th>
              <th style={titleStyle} className="mw105">
                {t("history_transaction_real")}
              </th>
              <th style={titleStyle} className="w8">
                {t("history_transaction_status")}
              </th>
            </tr>
          </thead>
          <tbody>
            <HistoryPaginate
              pageNumber={pageNumber}
              handleClick={handleClick}
            />
          </tbody>
        </Table>

        <div className="d-flex justify-content-center py-4 mt-4">
          <ReactPaginate
            previousLabel={t("history_previousLabel")}
            nextLabel={t("history_nextLabel")}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBtn"}
            previousLinkClassName={"previousBtn"}
            nextLinkClassName={"nextBtn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
            initialPage={pageNumber}
          />
        </div>
      </>
    );
  } else if (!allHistory.length && !historyLoading) {
    return <NoData />;
  } else {
    return (
      <div style={{ margin: "30px auto" }}>
        <BaseSpinner />
      </div>
    );
  }
};

const titleStyle = {
  fontSize: 12,
  lineHeight: 1.4,
  color: "#646464",
  fontWeight: "normal",
  verticalAlign: "middle",
};

export default HistoryAll;
