import { useContext, useEffect } from 'react';
import copy from 'copy-to-clipboard';

// Context
import HistoryContext from '../../context/history/HistoryContext';

// Style
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import redIcon from '../../Assets/i_usdt_red.png';
import blueIcon from '../../Assets/i_usdt_blue.png';
import purpleIcon from '../../Assets/i_usdt_purple.png';
import copyIcon from '../../Assets/i_copy.png';

const HistoryAllDetail = props => {
  const historyContext = useContext(HistoryContext);
  const { singleDetail, setSingleDetail } = historyContext;

  useEffect(() => {
    return () => {
      setSingleDetail(null);
    };
    // eslint-disable-next-line
  }, []);

  const handleCopy = value => {
    copy(value);

    if (copy(value)) {
      alert('複製成功');
    } else {
      alert('複製失敗，請手動複製');
    }
  };

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" size="md" centered>
      <Modal.Header style={{ borderBottom: 'none' }}>
        <div style={headerTitle} className="">
          <img
            className=""
            style={iconStyle}
            src={
              singleDetail.type === 0 ? blueIcon : singleDetail.type === 1 ? redIcon : purpleIcon
            }
            alt="status icon"
          />
          <p
            style={textStyle}
            className={
              singleDetail.type === 0 ? 'txt14' : singleDetail.type === 1 ? 'txt14_r' : 'txt14_p'
            }
          >
            {singleDetail.type === 0
              ? '買入'
              : singleDetail.type === 1
              ? '賣出'
              : singleDetail.type === 2
              ? '轉出'
              : '轉入'}
          </p>
        </div>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <div style={gridBox} className="">
          <div style={gridContent1}>
            <p className="txt_12_grey mb-0">日期</p>
            <p className="mb-0">{singleDetail.date}</p>
          </div>

          <div style={gridContent2}>
            <p className="txt_12_grey mb-0">狀態</p>
            <p className="mb-0">完成</p>
          </div>

          <div style={gridContent4}>
            <p className="txt_12_grey mb-0">交易額(USDT)</p>
            <p
              className={
                singleDetail.type === 0 || singleDetail.type === 3 ? 'c_green mb-0' : 'c_red mb-0'
              }
            >
              {Math.abs(singleDetail.usdtAmt).toFixed(2)}
            </p>
          </div>

          <div style={gridContent5}>
            <p className="txt_12_grey mb-0">結餘(USDT)</p>
            {/* <p className="mb-0">{singleDetail.balance}</p> */}
            <p className="mb-0 ">{props.balance}</p>
          </div>

          <div style={gridContent6} className="text-left">
            <div className="d-flex align-items-center justify-content-between">
              <p className="txt_12_grey mb-0">交易回執</p>
              <img
                src={copyIcon}
                alt="copy icon"
                style={{ width: 12, height: 14, cursor: 'pointer' }}
                onClick={() => handleCopy(singleDetail.txHASH)}
              />
            </div>
            <p
              style={{ transformOrigin: '0', transform: 'scale(0.6)', width: '170%' }}
              className="mb-0 text-break"
            >
              {singleDetail.txHASH}
            </p>
          </div>

          <div style={gridContent7}>
            <p className="txt_12_grey mb-0">
              手續費
              {singleDetail.type === 2 || singleDetail.type === 3 ? '(USDT)' : '%'}
            </p>
            <p className="mb-0">{singleDetail.charge}</p>
          </div>

          <div style={gridContent8}>
            <p className="txt_12_grey mb-0">兌換價</p>
            <p className="mb-0">
              {singleDetail.exchangePrice && singleDetail.exchangePrice.toFixed(2)}
            </p>
          </div>

          <div style={gridContent9}>
            <p className="txt_12_grey mb-0">RMB</p>
            <p className="mb-0">{singleDetail.rmb && singleDetail.rmb.toFixed(2)}</p>
          </div>

          <div style={gridContent10}>
            <p className="txt_12_grey mb-1">帳號</p>
            <p className="mb-0">{singleDetail.account}</p>
          </div>

          <div style={gridContent11}>
            <p className="txt_12_grey mb-1">收款人</p>
            <p className="mb-0">{singleDetail.payee}</p>
          </div>

          <div style={gridContent12}>
            <p className="txt_12_grey mb-1">銀行</p>
            <p className="mb-0">{singleDetail.bank}</p>
          </div>

          <div style={gridContent13}>
            <p className="txt_12_grey mb-1">分行</p>
            <p className="mb-0">{singleDetail.branch}</p>
          </div>
        </div>

        <div className="mx-auto" style={{ maxWidth: '200px', marginTop: 22 }}>
          <Button className="close_btn w-100" style={closeBtn} onClick={props.onHide}>
            關閉
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const gridBox = {
  display: 'grid',
  gridTemplateRows: 'repeat(6, min-content)',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridGap: 1,
};

// Category
const headerTitle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// const gridContent1 = {
//   gridColumn: '1 / 3 ',
//   border: '1px solid #D9E2F1',
//   margin: '0 -1px -1px 0',
//   borderBottom: 'none',
//   borderRight: 'none',

//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// };

//  Date
const gridContent1 = {
  gridColumn: '1 / 7',
  border: '1px solid #D9E2F1',
  margin: '0 -1px -1px 0',
  borderBottom: 'none',
  borderRight: 'none',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 10,
};

// Status
const gridContent2 = {
  gridColumn: '7 / -1',
  border: '1px solid #D9E2F1',
  margin: '0 0 -1px 0',
  borderBottom: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 10,
};

// 交易額
const gridContent4 = {
  gridColumn: '1 / 7',
  border: '1px solid #D9E2F1',
  margin: '0 -2px -1px 0',
  borderBottom: 'none',
  borderRight: 'none',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 10,
};

// 結餘
const gridContent5 = {
  gridColumn: '7 / -1',
  border: '1px solid #D9E2F1',
  margin: '0 0 -1px 0',
  borderBottom: 'none',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 10,
};

// 交易回執
const gridContent6 = {
  gridColumn: '1 / 7',
  border: '1px solid #D9E2F1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderBottom: 'none',
  margin: '0 -1px -1px 0',
  borderRight: 'none',
  padding: 10,
};

// 手續費
const gridContent7 = {
  gridColumn: '7 / -1',
  border: '1px solid #D9E2F1',
  margin: '0 0-1px 0',
  borderBottom: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 10,
};

// 兌換價
const gridContent8 = {
  gridColumn: '1 / 7',
  border: '1px solid #D9E2F1',
  margin: '0 -1px -1px 0',
  borderBottom: 'none',
  borderRight: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 10,
};

// RMB
const gridContent9 = {
  gridColumn: '7 / -1',
  border: '1px solid #D9E2F1',
  margin: '0 0 -1px 0',
  borderBottom: 'none',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 10,
};

// 帳號
const gridContent10 = {
  gridColumn: '1 / 7',
  border: '1px solid #D9E2F1',
  margin: '0 -1px -1px 0',
  borderBottom: 'none',
  borderRight: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 10,
};

// 收款人
const gridContent11 = {
  gridColumn: '7 / -1',
  border: '1px solid #D9E2F1',
  margin: '0 0 -1px 0',
  borderBottom: 'none',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 10,
};

// 銀行
const gridContent12 = {
  gridColumn: '1 / 7',
  border: '1px solid #D9E2F1',
  margin: '0 -1px -1px 0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 10,
  borderRight: 'none',
};

// 分行
const gridContent13 = {
  gridColumn: '7 / -1',
  border: '1px solid #D9E2F1',
  margin: '0 0 -1px 0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 10,
};

const iconStyle = {
  height: 15,
  width: 15,
  marginRight: 4,
};

const textStyle = {
  alignItems: 'center',
  marginBottom: 0,
};

const closeBtn = {
  padding: '15px 60px',
  width: '100%',
  fontSize: 16,
  lineHeight: '1.8',
  backgroundColor: '#fff',
  border: '1px solid #D7E2F3',
  borderRadius: '5px',
  color: '#646464',
  overflow: 'hidden',
};

export default HistoryAllDetail;
