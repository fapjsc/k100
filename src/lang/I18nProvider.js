import React, { useState } from "react";
import I18nContext from "./I18nContext";

const host = process.env.REACT_APP_HOST_NAME;

let lan;

if (host === "88U") {
  lan = "zh-HK";
}

if (host === "K100U") {
  lan = "zh-CN";
}

const I18nProvider = (props) => {
  // zh-HK
  // zh-CN
  // en-US
  const [locale, setLocale] = useState(lan);
  // const [locale, setLocale] = useState("zh-CN");

  const i18n = {
    t: (key) => props.translations[locale][key],
    getLocale: () => locale,
    setLocale: (locale) => setLocale(locale),
  };

  return (
    <I18nContext.Provider value={i18n}>{props.children}</I18nContext.Provider>
  );
};

export default I18nProvider;
