import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { agentReducer } from "./reducers/agentReducer";
import { instantReducer } from "./reducers/instantReducer";
import { orderReducer } from "./reducers/orderReducer";

const reducer = combineReducers({
  agent: agentReducer,
  instant: instantReducer,
  order: orderReducer,
});

const store = createStore(reducer, composeWithDevTools());

export default store;
