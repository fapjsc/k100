import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// 持久化存储 state
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { agentReducer } from "./reducers/agentReducer";
import { instantReducer } from "./reducers/instantReducer";
import { orderReducer } from "./reducers/orderReducer";
import { expiredReducer } from "./reducers/expiredReducer";
import { autoPickReducer } from "./reducers/autoPickReducer";
import { bankFormReducer } from "./reducers/bankFormReducer";
import { memberChatReducer } from "./reducers/memberChatReducer";
import {
  setKycReducer,
  getKycReducer,
  removeKycReducer,
} from "./reducers/kycReducer";

import { setUserReducer, getUserReducer } from "./reducers/userReducer";

import {
  setAccountReducer,
  currentAccountReducer,
  accHistoryReducer,
} from "./reducers/accountReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["bankForm"], // only member will be persisted
};

const middleware = [thunk];

const reducer = combineReducers({
  agent: agentReducer,
  instant: instantReducer,
  order: orderReducer,
  setAccount: setAccountReducer,
  currentAcc: currentAccountReducer,
  historyAcc: accHistoryReducer,
  expired: expiredReducer,
  autoPick: autoPickReducer,
  bankForm: bankFormReducer,
  memberChat: memberChatReducer,
  setKyc: setKycReducer,
  getKyc: getKycReducer,
  removeKyc: removeKycReducer,
  setUser: setUserReducer,
  getUer: getUserReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    storage.removeItem("persist:root");
    return reducer(undefined, action);
  }

  return reducer(state, action);
};

// 持久化根reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export const persisStore = persistStore(store);

export default store;
