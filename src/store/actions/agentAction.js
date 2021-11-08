import { OPEN_WEB_PUSH_NOTIFY, SET_DEVICE_ID } from '../type';

export const setOpenWebPushNotify = value => {
  return {
    type: OPEN_WEB_PUSH_NOTIFY,
    openWebPushNotify: value,
  };
};

export const setDeviceIdAction = value => {
  return {
    type: SET_DEVICE_ID,
    payload: value,
  };
};
