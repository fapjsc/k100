import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { I18nProvider } from "./lang/index";
import { ConfigProvider } from "antd-mobile";
import zhTW from "antd-mobile/es/locales/zh-TW";

import App from "./App";
import "./index.scss";

// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persisStore } from "./store/store";

const locales = ["en-US", "zh-TW", "zh-HK"];
const translations = {
  "en-US": require("./locales/en-US").default,
  "zh-HK": require("./locales/zh-HK").default,
  "zh-CN": require("./locales/zh-CN").default,
};

if (process.env.REACT_APP_HOST_NAME) {
  // document.querySelector('meta[name="description"]').setAttribute("content", '');
  // document.querySelector('title').setAttribute("content", '');
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persisStore}>
      <HashRouter>
        <I18nProvider locales={locales} translations={translations}>
          <ConfigProvider locale={zhTW}>
            <App />
          </ConfigProvider>
        </I18nProvider>
      </HashRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
