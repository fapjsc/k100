import Modal from 'react-bootstrap/Modal';
import searchIcon from '../../Assets/icon_search.gif';

const Pairing = props => {
    const { title, text } = props;
    return (
        <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header
                closeButton
                style={{
                    border: 'none',
                }}
            ></Modal.Header>
            <Modal.Body
                style={{
                    textAlign: 'center',
                }}
                className="p-4"
            >
                <img src={searchIcon} alt="search icon" />
                <h4
                    className="text-primary h1"
                    style={{
                        fontSize: 30,
                        margin: 20,
                    }}
                >
                    {title}
                </h4>
                <p
                    className="h2"
                    style={{
                        marginBottom: 80,
                    }}
                >
                    {text}
                </p>
            </Modal.Body>
        </Modal>
    );
};

export default Pairing;
