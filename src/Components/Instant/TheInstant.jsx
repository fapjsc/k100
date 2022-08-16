import { useEffect, useContext, useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Actions
import { setOpenWebPushNotify } from "../../store/actions/agentAction";
import { autoPickReq } from "../../store/actions/autoPickAction";

// Play Sound
import useSound from "use-sound";
import newOrderSound from "../../Assets/mp3/newOrder.mp3";

// Context
import InstantContext from "../../context/instant/InstantContext";
import HttpErrorContext from "../../context/httpError/HttpErrorContext";

// Lang Context
import { useI18n } from "../../lang";

// Components
import InstantNav from "./InstantNav";
import InstantAll from "./InstantAll";
import InstantOnGoing from "./InstantOnGoing";

// Firebase Web Push
import { deleteToken } from "../../firebaseInit";

// Style
import BaseSpinner from "../Ui/BaseSpinner";

import Button from "react-bootstrap/Button";

const TheInstant = () => {
  const [playbackRate] = useState(0.6);
  // Redux
  const dispatch = useDispatch();
  const { openWebPushNotify, setDeviceId } = useSelector(
    (state) => state.agent
  );

  const {
    data: autoPickData,
    loading: autoPickLoading,
    error: autoPickError,
  } = useSelector((state) => state.autoPick);
  const { AutoMode } = autoPickData || {};

  const { status: setDeviceIdStatus, error: setDeviceIdError } = setDeviceId;

  // Lang Context
  const { t } = useI18n();

  // Init State
  const [tab, setTab] = useState("all");
  const [play, { stop }] = useSound(newOrderSound, {
    playbackRate,
    loop: true,
    interrupt: false,
  });
  // const [loop, setLoop] = useState();
  const [soundState, setSoundState] = useState(
    localStorage.getItem("openSound")
  );
  // const [autoPick, setAutoPick] = useState("");
  // const [notifyPermission, setNotifyPermission] = useState('');

  // Instant Context
  const instantContext = useContext(InstantContext);
  const {
    connectInstantWs,
    instantOngoingWsConnect,
    cleanAll,
    instantAllClient,
    instantOnGoingClient,
    instantData,
    wsOnGoingData,
  } = instantContext;

  // HttpError Context
  const httpError = useContext(HttpErrorContext);
  const { httpLoading } = httpError;

  // ===========
  //  useEffect
  // ===========
  useEffect(() => {
    if (instantOnGoingClient) instantOnGoingClient.close();
    if (instantAllClient) instantAllClient.close();
    connectInstantWs();
    instantOngoingWsConnect();

    return () => {
      if (instantOnGoingClient) instantOnGoingClient.close();
      if (instantAllClient) instantAllClient.close();
      cleanAll();
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (soundState) localStorage.setItem("openSound", true);
    if (!soundState) localStorage.removeItem("openSound");

    if (JSON.parse(soundState) && instantData.length > 0) {
      console.log(soundState, instantData.length);
      // 即時買賣新訂單聲音提示
      play();
    }

    if (soundState && instantData.length === 0) {
      stop();
      // clearInterval(soundLoop);
    }

    return () => {
      stop();
      // clearInterval(soundLoop);
    };
  }, [instantData, soundState, stop, play]);

  useEffect(() => {
    if (openWebPushNotify) {
      localStorage.setItem("openNotify", "yes");
    }

    if (!openWebPushNotify) {
      deleteToken();
      localStorage.removeItem("openNotify");
    }
  }, [openWebPushNotify, dispatch]);

  const handleStopSound = () => {
    stop();
    // clearInterval(loop);
  };

  const webPushClickHandler = () => {
    if (!window.Notification) {
      alert(t("web_push_not_support"));
      return;
    }

    if (setDeviceIdError) {
      alert(setDeviceIdError);
      return;
    }
    // console.log(Notification.permission);

    if (
      Notification.permission === "granted" ||
      Notification.permission === "default"
    ) {
      dispatch(setOpenWebPushNotify(!openWebPushNotify));
      // setNotifyPermission('granted');
    }

    if (Notification.permission === "denied") {
      // setNotifyPermission('denied');
      dispatch(setOpenWebPushNotify(false));
      alert(t("web_push_open_notify_request"));
    }
  };

  useEffect(() => {
    // mode: 0 手動
    // mode: 1 自動
    // mode: -1 查詢
    if (process.env.REACT_APP_HOST_NAME === "K100U") {
      dispatch(autoPickReq({ mode: -1 }));
    }
  }, [dispatch]);

  const autoPickHandler = () => {
    // 自動轉手動
    if (AutoMode === 1) {
      dispatch(autoPickReq({ mode: 0 }));
    }

    // 手動轉自動
    if (AutoMode === 0) {
      dispatch(autoPickReq({ mode: 1 }));
    }
  };

  useEffect(() => {
    if (autoPickError) {
      alert(`自動接單錯誤：${autoPickError}`);
    }
  }, [autoPickError]);

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-start align-items-center">
        <p className="mb-0 mr-auto" style={{ fontSize: 12, color: "#fff" }}>
          {t("instant_transaction")}
        </p>

        {setDeviceIdStatus === "pending" ? (
          <Button className="btn-info mr-4" disabled>
            Loading...
          </Button>
        ) : (
          <Button
            className={
              openWebPushNotify && !setDeviceIdError
                ? "btn-info mr-4"
                : "btn-danger mr-4"
            }
            onClick={webPushClickHandler}
          >
            {openWebPushNotify && !setDeviceIdError
              ? t("web_push_button_allow")
              : t("web_push_button_deny")}
          </Button>
        )}

        <Button
          className={soundState ? "btn-info" : "btn-danger"}
          onClick={() => setSoundState((pre) => !pre)}
        >
          {!soundState ? t("instant_sound_close") : t("instant_sound_open")}
        </Button>

        {/* Auto Pick */}
        {autoPickLoading && (
          <button className="btn-info ml-3" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        )}
        {autoPickData && !autoPickLoading && (
          <Button
            className={AutoMode === 1 ? "btn-info" : "btn-danger"}
            style={{ marginLeft: "1rem" }}
            onClick={autoPickHandler}
          >
            {AutoMode === 0 && t("instant_auto_pick_close")}
            {AutoMode === 1 && t("instant_auto_pick")}
          </Button>
        )}
      </div>
      <div className="contentbox">
        {/* Tab Link */}
        <InstantNav setTab={setTab} tab={tab} />
        {/* Content */}
        {tab === "all" && instantData ? (
          <InstantAll stop={handleStopSound} />
        ) : null}
        {tab === "onGoing" && wsOnGoingData ? <InstantOnGoing /> : null}
        {/* Loading */}
        {/* {httpLoading && (
          <div className="mt-4">
            <BaseSpinner />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default TheInstant;
