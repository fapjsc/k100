import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { I18nProvider } from './lang/index';

import App from './App';
import './index.scss';

const locales = ['en-US', 'zh-TW'];
const translations = {
  'en-US': require('./locales/en-US').default,
  'zh-HK': require('./locales/zh-HK').default,
  'zh-CN': require('./locales/zh-CN').default,
};

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <I18nProvider locales={locales} translations={translations}>
        <App />
      </I18nProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
