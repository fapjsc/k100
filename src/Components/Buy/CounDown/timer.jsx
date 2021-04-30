const timer = ({ minutes, seconds, completed }) => {
  // Render a countdown
  return (
    <span className="c_yellow">
      {minutes}:{seconds}
    </span>
  );
};

export default timer;
