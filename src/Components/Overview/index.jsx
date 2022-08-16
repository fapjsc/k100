import { useContext } from "react";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";

import { setShowMemberChat } from "../../store/actions/memberChatActions";

// Context
import AuthContext from "../../context/auth/AuthContext";
import { useI18n } from "../../lang/";

// Components
import TheInstant from "../Instant/TheInstant";
import MemberChat from "../member-chat/MemberChat";

// Style
import "./index.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import classes from "./overView.module.scss";
import phoneImg from "../../Assets/k100u-phone.png";
import memberLevelImg from "../../Assets/88u/會員等級.png";

import { Image } from "antd-mobile";

const OverView = () => {
  // Auth Context
  const authContext = useContext(AuthContext);
  const { isAgent } = authContext;

  const dispatch = useDispatch();

  // Lang Context
  const { t } = useI18n();

  return (
    <>
      <Container className={classes.container}>
        {process.env.REACT_APP_HOST_NAME === "88U" && !isAgent && (
          <div style={{ marginTop: "3rem" }}>
            <Image
              src={memberLevelImg}
              alt="會員等級說明"
              style={{ margin: "3rem 0" }}
            />
          </div>
        )}

        <MemberChat />

        <div className={classes["cs-button"]}>
          <button onClick={() => dispatch(setShowMemberChat())}>客服</button>
        </div>

        <p className="welcome_txt text-left pl-0">{t("welcome_text")}</p>

        <Row className="">
          <Col className="" as={Col} md={3} xs={6}>
            <Link
              className="home_btn w-100 border border-dark"
              style={backImg1}
              to="/home/transaction/buy"
            >
              <div className="trade"></div>
              <p>{t("overView_transaction")}</p>
            </Link>
          </Col>
          <Col className="" as={Col} md={3} xs={6}>
            <Link
              className="home_btn w-100 border border-dark"
              to="/home/transaction/transfer"
            >
              <div className="i_01"></div>
              <p>{t("overView_transfer")}</p>
            </Link>
          </Col>

          <Col className="" as={Col} md={3} xs={6}>
            <Link
              className="home_btn w-100 border border-dark"
              to="/home/wallet"
            >
              <div className="i_wallet"></div>
              <p>{t("overView_wallet")}</p>
            </Link>
          </Col>
          <Col className="" as={Col} md={3} xs={6}>
            <Link
              className="home_btn w-100 border border-dark"
              to="/home/history"
            >
              <div className="i_trans"></div>
              <p>{t("overView_history")}</p>
            </Link>
          </Col>
        </Row>

        {!isAgent && (
          <section className={classes.landingBlock}>
            <div className={classes.textBox}>
              <h2 className={classes.title}>{t("slogan_title")}</h2>
              <p className={classes.subText}>{t("slogan_sub_text_1")}</p>
              <p className={classes.subText}>{t("slogan_sub_text_2")}</p>
            </div>
            <div className={classes.imgBox}>
              <img className={classes.phone} src={phoneImg} alt="phone" />
            </div>
          </section>
        )}

        {isAgent && (
          <Row className="mt-4">
            <Col lg={12}>
              <TheInstant />
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

const backImg1 = {
  // backgroundImage: 'url(../../Assets/1.jpg)',
  // backgroundSize: 'contain',
};

export default OverView;
