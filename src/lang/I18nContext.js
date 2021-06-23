import { createContext } from 'react';

const I18nContext = createContext({
  t: () => '', // 將定義的鍵值翻譯成對應的語系內容
  getLocale: () => {}, // 取得當前語系
  setLocale: () => {}, // 設置/變更當前語系
});

export default I18nContext;
