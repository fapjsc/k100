import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import { agentReducer } from "./reducers/agentReducer";
import { instantReducer } from "./reducers/instantReducer";
import { orderReducer } from "./reducers/orderReducer";
import {
  setAccountReducer,
  currentAccountReducer,
  accHistoryReducer,
} from "./reducers/accountReducer";

const middleware = [thunk];

const reducer = combineReducers({
  agent: agentReducer,
  instant: instantReducer,
  order: orderReducer,
  setAccount: setAccountReducer,
  currentAcc: currentAccountReducer,
  historyAcc: accHistoryReducer,
});

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
