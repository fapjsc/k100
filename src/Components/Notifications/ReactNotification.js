import React from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReactNotificationComponent = ({ title, body }) => {
  let hideNotify = title === '';

  const Display = () => {
    return (
      <div>
        <h4>{title}</h4>
        <p>{body}</p>
      </div>
    );
  };

  if (!hideNotify) {
    toast.info(<Display />);
  }

  return (
    <ToastContainer
      autoClose={3000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
    />
  );
};

ReactNotificationComponent.defaultProps = {
  title: 'This is title',
  body: 'Some body',
};

ReactNotificationComponent.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
};

export default ReactNotificationComponent;
