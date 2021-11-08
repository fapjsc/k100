import { OPEN_WEB_PUSH_NOTIFY, SET_DEVICE_ID } from '../type';

const initialState = {
  openWebPushNotify: localStorage.getItem('openNotify') === 'yes',
  setDeviceId: { error: '', status: '', data: null },
};

export const agentReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_WEB_PUSH_NOTIFY:
      return {
        ...state,
        openWebPushNotify: action.openWebPushNotify,
      };

    case SET_DEVICE_ID:
      return {
        ...state,
        setDeviceId: action.payload,
      };

    default:
      return state;
  }
};
