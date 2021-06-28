import './index.scss';
import { useI18n } from '../../lang';

const NoData = () => {
  const { t } = useI18n();
  return (
    <div className="nodata-imgBox">
      <p>{t('no_data')}</p>
    </div>
  );
};

export default NoData;
