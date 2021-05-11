import { SET_WALLET_DATA, SET_WALLET_TYPE } from '../type';

const WalletReducer = (state, action) => {
  switch (action.type) {
    case SET_WALLET_TYPE:
      return {
        ...state,
        walletType: action.payload,
      };
    case SET_WALLET_DATA:
      return {
        ...state,
        walletData: action.payload,
      };
    default:
      return state;
  }
};

export default WalletReducer;
