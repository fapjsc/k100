import { useState, useEffect } from 'react';
import Timer from './Timer';

const StopWatch = ({ deltaTime }) => {
  const [second, setSecond] = useState(deltaTime);

  useEffect(() => {
    let secondInterval = setInterval(() => {
      setSecond(second => second + 1);
    }, 1000);
    return () => {
      clearInterval(secondInterval);
    };
    // eslint-disable-next-line
  }, []);

  return <Timer second={second} />;
};

export default StopWatch;
