const CountDownTimer = ({ minutes, seconds }) => {
  return (
    <span className="c_yellow ">
      {('0' + minutes).slice(-2)}:{('0' + seconds).slice(-2)}
    </span>
  );
};

export default CountDownTimer;
