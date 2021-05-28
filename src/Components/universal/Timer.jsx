import React from 'react';

export default function Timer({ second, minute }) {
  return (
    <div className="timer">
      <span className="c_yellow">{('0' + Math.floor(second / 60)).slice(-2)}:</span>
      <span className="c_yellow">{('0' + Math.floor(second % 60)).slice(-2)}</span>
      {/* <span className="digits mili-sec">{('0' + ((props.time / 10) % 100)).slice(-2)}</span> */}
    </div>
  );
}
