import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { agentReducer } from './reducers/agentReducer';

const reducer = combineReducers({
  agent: agentReducer,
});

const store = createStore(reducer, composeWithDevTools());

export default store;
