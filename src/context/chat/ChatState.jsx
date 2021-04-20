import { useReducer } from 'react';

import ChatReducer from './ChatReducer';
import ChatContext from './ChatContext';

import { SET_TRANSLATE } from '../type';

const ChatState = props => {
  const initialState = {
    isTranslate: false,
  };

  const setTranslate = value => {
    dispatch({ type: SET_TRANSLATE, payload: value });
  };

  const [state, dispatch] = useReducer(ChatReducer, initialState);

  return (
    <ChatContext.Provider
      value={{
        isTranslate: state.isTranslate,
        setTranslate,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatState;
