// Lang Context
import { useI18n } from '../../lang';

// Style
import Modal from 'react-bootstrap/Modal';
import errorIcon from '../../Assets/icon-error-new.png';
import closeBtn from '../../Assets/blue_close_btn.png';

const NoOrder = props => {
  const { t } = useI18n();
  return (
    <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body className="text-right">
        <img
          src={closeBtn}
          alt="close btn"
          style={{
            cursor: 'pointer',
          }}
          onClick={props.onHide}
        />
        <div className="text-center">
          <img src={errorIcon} alt="icon" className="" style={iconStyle} />
          <h3 className="" style={titleStyle}>
            {t('no_order')}
          </h3>
          <div className="">
            <span style={textStyle}>
              {t('exRate')}：{props.exRate}
            </span>
            <span style={textStyle}>&nbsp;&nbsp;I&nbsp;&nbsp;</span>
            <span style={textStyle}>{props.type === '買' ? t('no_order_buy') : t('no_order_sell')}</span>
            <span style={textStyle}>&nbsp;{props.usdt}&nbsp;USDT</span>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const iconStyle = {
  maxWidth: '100px',
};

const titleStyle = {
  fontSize: 30,
  fontWeight: '300',
  color: '#3f80fa',
  marginTop: 35,
  marginBottom: 8,
};

const textStyle = {
  fontSize: 16,
  lineHeight: 1.9,
  color: '#383737',
  fontWeight: 'bold',
};
export default NoOrder;
