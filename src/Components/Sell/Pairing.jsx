import Modal from 'react-bootstrap/Modal';
import searchIcon from '../../Assets/icon_search.gif';

import closeBtn from '../../Assets/blue_close_btn.png';

const Pairing = props => {
  const { title, text } = props;
  return (
    <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body className="text-right">
        <img
          src={closeBtn}
          alt="close btn"
          onClick={props.onHide}
          style={{
            cursor: 'pointer',
          }}
          //   onClick={props.backToHome}
        />

        <div className="text-center">
          <img src={searchIcon} alt="search icon" />
          <h3
            className=""
            style={{
              color: '#3f80fa',
            }}
          >
            {title}
          </h3>
          <p className="" style={{}}>
            {text}
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Pairing;
