import { useState, useEffect } from 'react';
import Timer from './Timer';

const StopWatch = ({ deltaTime }) => {
  //   const [isActive, setIsActive] = useState(true);
  //   const [isPaused, setIsPaused] = useState(false);
  const [second, setSecond] = useState(deltaTime);
  //   const [minute, setMinute] = useState(0);

  useEffect(() => {
    let secondInterval = setInterval(() => {
      setSecond(second => second + 1);
    }, 1000);
    return () => {
      clearInterval(secondInterval);
      //   setMinute(minute => minute + 1);
    };
    // eslint-disable-next-line
  }, []);

  //   const handleStart = () => {
  //     setIsActive(true);
  //     setIsPaused(false);
  //   };

  //   const handlePauseResume = () => {
  //     setIsPaused(!isPaused);
  //   };

  //   const handleReset = () => {
  //     setIsActive(false);
  //     setTime(0);
  //   };

  return <Timer second={second} />;
};

export default StopWatch;
