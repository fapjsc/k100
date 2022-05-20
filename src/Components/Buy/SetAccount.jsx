import React from "react";

// Style
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Lang Context
import { useI18n } from "../../lang";

// Utils
import { locationMoneyPrefix } from "../../lib/utils";

const SetAccount = (props) => {
  // Lang Context
  const { t } = useI18n();

  // 千分位加逗號
  const thousandBitSeparator = (num) => {
    return (
      num &&
      // eslint-disable-next-line
      (num.toString().indexOf(".") != -1
        ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + ",";
          })
        : num.toString().replace(/(\d)(?=(\d{3}))/g, function ($0, $1) {
            return $1 + ",";
          }))
    );
  };

  return (
    <Row
      style={confirmBuyTextBox}
      className="px-2 justify-content-between pl-4"
    >
      <Col className="pl-0" xl={12} lg={12} sm={12}>
        <p className="txt_12_grey mb-0">{t("buy_total")}</p>
        <p className="c_blue">
          {thousandBitSeparator(Number(props.rmbAmt).toFixed(2).toString())}
          &nbsp; {locationMoneyPrefix()}
        </p>
      </Col>

      <Col className="pl-0" xl={12} lg={12} sm={12}>
        <p className="txt_12_grey mb-0">{t("buy_quantity")}</p>
        <p className=" mb-0">
          {/* 小數第二位，千分逗號 */}
          {thousandBitSeparator(Number(props.usdtAmt).toFixed(2).toString())}
          &nbsp; USDT
        </p>
      </Col>
    </Row>
  );
};

const confirmBuyTextBox = {
  padding: 20,
  borderRadius: "5px",
  border: "2px solid #3f80fa",
  // display: 'flex',
  // justifyContent: 'space-between',
  fontSize: "20px",
  fontWeight: "bold",
  height: "100%",
};

export default SetAccount;
