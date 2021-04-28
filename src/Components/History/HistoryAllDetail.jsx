import Modal from 'react-bootstrap/Modal';
import downIcon from '../../Assets/i_usdt_down.png';
import redIcon from '../../Assets/i_usdt_red.png';
import blueIcon from '../../Assets/i_usdt_blue.png';
import purpleIcon from '../../Assets/i_usdt_purple.png';

const HistoryAllDetail = props => {
  const { singleDetail } = props;
  console.log(singleDetail);
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" size="md">
      <Modal.Header closeButton style={{ borderBottom: 'none' }}></Modal.Header>
      <Modal.Body className="show-grid">
        <div style={gridBox}>
          <div style={gridContent1}>
            <img
              src={
                singleDetail.type === 0 ? blueIcon : singleDetail.type === 1 ? redIcon : purpleIcon
              }
              alt="status icon"
              style={{
                height: 21,
                marginBottom: 3,
                marginRight: 8,
              }}
            />

            <p
              className={
                singleDetail.type === 0 ? 'txt18' : singleDetail.type === 1 ? 'txt18_r' : 'txt18_p'
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

          <div style={gridContent2}>
            <p className="txt_12_grey">{singleDetail.date}</p>
          </div>

          <div style={gridContent3}>
            <p className="txt_12_grey">狀態</p>
            <p>完成</p>
          </div>

          <div style={gridContent4}>
            <p className="txt_12_grey">交易額(USDT)</p>
            <p>{singleDetail.usdtAmt}</p>
          </div>

          <div style={gridContent5}>
            <p className="txt_12_grey">結餘(USDT)</p>
            <p>{singleDetail.balance}</p>
          </div>

          <div style={gridContent6}>
            <p className="txt_12_grey">交易回執</p>
          </div>

          <div style={gridContent7}>
            <p className="txt_12_grey">手續費%</p>
          </div>

          <div style={gridContent8}>
            <p className="txt_12_grey">兌換價</p>
          </div>

          <div style={gridContent9}>
            <p className="txt_12_grey">RMB</p>
          </div>

          <div style={gridContent10}>
            <p className="txt_12_grey">帳號</p>
          </div>

          <div style={gridContent11}>
            <p className="txt_12_grey">收款人</p>
          </div>

          <div style={gridContent12}>
            <p className="txt_12_grey">銀行</p>
          </div>

          <div style={gridContent13}>
            <p className="txt_12_grey">分行</p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const gridBox = {
  display: 'grid',
  gridTemplateRows: 'repeat(6, 1fr)',
  gridTemplateColumns: 'repeat(6, 1fr)',

  //   gridGap: 10,
};

const gridContent1 = {
  gridColumn: '1 / 2',
  border: '1px solid #D9E2F1',
  margin: '0 -1px -1px 0',
  padding: 10,
};

const gridContent2 = {
  gridColumn: '2 / 6',
  border: '1px solid #D9E2F1',
  margin: '0 -1px -1px 0',
  padding: 10,
};

const gridContent3 = {
  border: '1px solid #D9E2F1',
  margin: '0 0 -1px 0',
  padding: 10,
};

const gridContent4 = {
  gridColumn: '1 / 4',
  border: '1px solid #D9E2F1',
  margin: '0 -1px -1px 0',
  padding: 10,
};

const gridContent5 = {
  gridColumn: '4 / 7',
  border: '1px solid #D9E2F1',
  margin: '0 0 -1px 0',
  padding: 10,
};

const gridContent6 = {
  gridColumn: '1 / 4',
  border: '1px solid #D9E2F1',
  margin: '0 -1px -1px 0',
  padding: 10,
};

const gridContent7 = {
  gridColumn: '4 / 7',
  border: '1px solid #D9E2F1',
  margin: '0 0 -1px 0',
  padding: 10,
};

const gridContent8 = {
  gridColumn: '1 / 4',
  border: '1px solid #D9E2F1',
  margin: '0 -1px -1px 0',
  padding: 10,
};

const gridContent9 = {
  gridColumn: '4 / 7',
  border: '1px solid #D9E2F1',
  margin: '0 0 -1px 0',
  padding: 10,
};

const gridContent10 = {
  gridColumn: '1 / 4',
  border: '1px solid #D9E2F1',
  margin: '0 -1px -1px 0',
  padding: 10,
};

const gridContent11 = {
  gridColumn: '4 / 7',
  border: '1px solid #D9E2F1',
  margin: '0 0 -1px 0',
  padding: 10,
};

const gridContent12 = {
  gridColumn: '1 / 4',
  border: '1px solid #D9E2F1',
  margin: '0 -1px -1px 0',
  padding: 10,
};

const gridContent13 = {
  gridColumn: '4 / 7',
  border: '1px solid #D9E2F1',
  margin: '0 0 -1px 0',
  padding: 10,
};

export default HistoryAllDetail;
