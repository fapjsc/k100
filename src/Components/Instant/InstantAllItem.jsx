// Lang Context
import { useI18n } from "../../lang";

import moment from "moment";

// Components
import StopWatch from "../universal/StopWatch";

import { unitDate } from "../../lib/unitDate";

import useRwd from "../../hooks/useRwd";

// Utils
import {
  locationMoneyPrefix,
  locationMoneyCalcWithThousand,
  usdtThousandBitSeparator,
} from "../../lib/utils";

const InstantAllItem = ({ el, handleClick }) => {
  const { isMobile } = useRwd();
  const { t } = useI18n();
  if (el.MType === 2) {
    return (
      <div id="sell" className="tabcontent mt-4">
        {/* header */}
        <div
          className="d-flex align-items-center mt-4"
          style={{ maxWidth: "100%", gap: isMobile ? "1rem" : "3rem" }}
        >
          <span className="txt_12">
            <span> {t("instant_exRate")}：</span>
            <span>{el.D1.toFixed(2)}</span>
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <span className="i_clock mr-1" />
            <span className="">{t("instant_acc_time")}：</span>
            <StopWatch deltaTime={el.DeltaTime} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "1rem",
            }}
          >
            <span>
              {t("instant_name")}：{el?.P5?.split("|")[0]}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "1rem",
            }}
          >
            <span>
              {t("instant_timer")}：
              {moment(unitDate(el?.CreateDate)).format("MM-DD HH:mm")}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="row bb1 mx-0">
          <div className="lightblue_bg txt_16 col-md-8 col-12 d-flex align-items-center justify-content-between-mobile">
            {/* Usdt */}
            <div
              className="ml-2 mobile-margin0 w-50"
              style={{ marginRight: 100 }}
            >
              <span className="i_blue1" />
              <span className="blue mobile-text-md">
                {t("instant_buy")}&nbsp;
              </span>
              <span className="bold_22 blue mobile-text-md">
                {usdtThousandBitSeparator(el.UsdtAmt)}&nbsp;
              </span>
              <span
                className="blue mobile-text-md"
                style={{ fontWeight: "bold" }}
              >
                USDT
              </span>
            </div>

            {/* Cny */}
            <div className="w-50">
              <span className="i_cny" />
              <span className="mobile-text-md">
                {t("instant_pay")}&nbsp;{locationMoneyCalcWithThousand(el.D2)}{" "}
                {locationMoneyPrefix()}
              </span>
            </div>
          </div>

          <div className="col-md-1" />

          {/* Button */}
          <div className="col-md-3 col-12 px-0 mobile-marginTop mw400 mx-auto">
            <button
              onClick={() =>
                handleClick(
                  el.D1.toFixed(2),
                  el.D2.toFixed(2),
                  el.UsdtAmt,
                  "買",
                  el.token
                )
              }
              className="easy-btn margin0 w-100"
            >
              {t("btn_detail")}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div id="buy" className="tabcontent">
        {/* header */}
        <div
          className="d-flex align-items-center p-2"
          style={{ maxWidth: "100%", gap: isMobile ? "1rem" : "3rem" }}
        >
          <span className="txt_12">
            {t("instant_exRate")}：{el.D1.toFixed(2)}
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span className="i_clock mr-1" />
            <span className="">{t("instant_acc_time")}：</span>
            <StopWatch deltaTime={el.DeltaTime} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "1rem",
            }}
          >
            <span>
              {t("instant_name")}：{el?.P5?.split("|")[0]}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "1rem",
            }}
          >
            <span>
              {t("instant_timer")}：
              {moment(unitDate(el?.CreateDate)).format("MM-DD HH:mm")}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="row bb1 mx-0">
          <div className="lightblue_bg txt_16 col-md-8 col-12 d-flex align-items-center justify-content-between-mobile">
            {/* Usdt */}
            <div
              className="ml-2 mobile-margin0 w-50"
              style={{ marginRight: 100 }}
            >
              <span className="i_red" />
              <span className="red mobile-text-md">
                {t("instant_sell")}&nbsp;
              </span>
              <span className="bold_22 red mobile-text-md">
                {usdtThousandBitSeparator(el.UsdtAmt)}&nbsp;
              </span>
              <span
                className="red mobile-text-md"
                style={{ fontWeight: "bold" }}
              >
                USDT
              </span>
            </div>
            {/* Cny */}
            <div className="w-50">
              <span className="i_cny" />
              <span className="mobile-text-md">
                {t("instant_get")}&nbsp;{locationMoneyCalcWithThousand(el.D2)}{" "}
                {locationMoneyPrefix()}
              </span>
            </div>
          </div>

          <div className="col-md-1" />

          {/* Button */}
          <div className="col-md-3 col-12 px-0 mobile-marginTop mw400 mx-auto">
            <button
              onClick={() =>
                handleClick(
                  el.D1.toFixed(2),
                  el.D2.toFixed(2),
                  el.UsdtAmt,
                  "賣",
                  el.token
                )
              }
              className="easy-btn margin0 w-100"
            >
              {t("btn_detail")}
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default InstantAllItem;
