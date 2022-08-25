import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

// Hooks
import { useI18n } from "../../lang";

// Components
import NoData from "../NoData";
import ExpiredItem from "./ExpiredItem";
import BaseSpinner from "../Ui/BaseSpinner";

// Actions
import { getExpiredOrder } from "../../store/actions/expiredAction";

// Style
import Table from "react-bootstrap/Table";

const HistoryExpired = () => {
  const history = useHistory();

  const [currentItems, setCurrentItems] = useState(null);

  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.expired);

  const { t } = useI18n();

  useEffect(() => {
    dispatch(getExpiredOrder());
  }, [dispatch]);

  const onClickHandler = (item) => {

    const agent = localStorage.getItem("agent");

    if (agent) {
      if (item.MasterType === 0) {
        history.push(`/home/instant/sell/${item.token}`);
      }

      if (item.MasterType === 1) {
        history.push(`/home/instant/buy/${item.token}`);
      }
    } else {
      if (item.MasterType === 0) {
        history.push(`/home/transaction/buy/${item.token}`);
      }

      if (item.MasterType === 1) {
        history.push(`/home/transaction/sell/${item.token}`);
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "15rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BaseSpinner />
      </div>
    );
  }

  if (!data?.length) {
    return <NoData />;
  }

  return (
    <>
      <Table responsive bordered hover className="mt-4">
        <thead>
          <tr>
            <th style={titleStyle} className="w55">
              {/* 日期 */}
              {t("history_date")}
            </th>
            <th style={titleStyle} className="mw105">
              {/* {`交易额（USDT)`} */}
              {t("history_transaction_deal")}
            </th>
            <th style={titleStyle} className="mw105">
              {t("history_transaction_price")}
            </th>
            <th style={titleStyle} className="mw105">
              {t("history_currency")}
            </th>
          </tr>
        </thead>

        <tbody>
          {currentItems?.map((h) => (
            <tr
              key={h.token}
              style={{ cursor: "pointer" }}
              onClick={() => onClickHandler(h)}
            >
              {/* 日期 */}
              <td className="" style={dateText}>
                {h.Date}
              </td>

              {/* 交易額 */}
              <td style={transactionAmount} className="text-right pr-4">
                {h.UsdtAmt.toFixed(2)}
              </td>

              {/* 兌換架 */}
              <td className="text-right" style={statusStyle}>
                {h.D1}
              </td>

              {/* ＲＭＢ*/}
              <td className="text-right" style={statusStyle}>
                {h.D2}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ExpiredItem
        setCurrentItems={setCurrentItems}
        itemsPerPage={10}
        items={data}
      />
    </>
  );
};

const titleStyle = {
  fontSize: 12,
  lineHeight: 1.4,
  color: "#646464",
  fontWeight: "normal",
  verticalAlign: "middle",
};

const dateText = {
  fontSize: 12,
  lineHeight: 1.4,
  color: "#000",
  verticalAlign: "middle",
};

const transactionAmount = {
  fontSize: 12,
  lineHeight: 1.4,
  verticalAlign: "middle",
};

const statusStyle = {
  fontSize: 12,
  lineHeight: 1.4,
  verticalAlign: "middle",
};

export default HistoryExpired;
