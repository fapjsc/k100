import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getToken } from '../../firebaseInit.js';

// Redux
import { useDispatch } from 'react-redux';

// Actions
import { setDeviceIdAction } from '../../store/actions/agentAction';

// Hooks
import useHttp from '../../hooks/useHttp';

// Apis
import { sendWebPushToken } from '../../lib/api';

const Notifications = props => {
  const history = useHistory();

  // Redux
  const dispatch = useDispatch();

  const [isTokenFound, setTokenFound] = useState(false);

  const {
    status: sendDeviceStatus,
    error: sendDeviceError,
    data: sendDeviceData,
    sendRequest: sendDeviceIdToServerRequest,
  } = useHttp(sendWebPushToken);

  // console.log('Token found', isTokenFound);

  useEffect(() => {
    if (sendDeviceError) {
      if (!localStorage.getItem('token')) {
        localStorage.clear();
        history.replaceState('/');
      }
    }
    dispatch(
      setDeviceIdAction({
        error: sendDeviceError,
        status: sendDeviceStatus,
        data: sendDeviceData,
      })
    );
  }, [sendDeviceStatus, sendDeviceError, sendDeviceData, dispatch, history]);

  // To load once
  useEffect(() => {
    let data;
    dispatch(
      setDeviceIdAction({
        status: 'pending',
      })
    );
    const tokenFunc = async () => {
      data = await getToken(setTokenFound);
      // console.log(data);

      if (data) {
        sendDeviceIdToServerRequest(data);
        // console.log('Token is', data);
      } else {
        dispatch(setDeviceIdAction({}));
      }

      return data;
    };

    tokenFunc();
  }, [setTokenFound, sendDeviceIdToServerRequest, dispatch]);

  return <></>;
};

Notifications.propTypes = {};

export default React.memo(Notifications);
