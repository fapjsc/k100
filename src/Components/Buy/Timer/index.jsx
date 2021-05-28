const Timer = ({ minutes, seconds }) => {
  return (
    <span>
      {('0' + minutes).slice(-2)}:{('0' + seconds).slice(-2)}
    </span>
  );
};

export default Timer;
