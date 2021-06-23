import React from 'react';
import I18nContext, { I18nContextProps } from './I18nContext';

export const withI18n = () => {
  return WrappedComponent => {
    const ComponentWithI18n = props => <I18nContext.Consumer>{i18n => <WrappedComponent {...i18n} {...props} />}</I18nContext.Consumer>;
    return ComponentWithI18n;
  };
};

export default withI18n;
