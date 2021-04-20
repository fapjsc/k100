import { SET_TRANSLATE } from '../type';

const ChatReducer = (state, action) => {
  switch (action.type) {
    case SET_TRANSLATE:
      return {
        ...state,
        isTranslate: action.payload,
      };
    default:
      return state;
  }
};

export default ChatReducer;
