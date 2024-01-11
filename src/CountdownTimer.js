import React, { useState, useEffect, useRef } from 'react';
// import Countdown from 'react-countdown';

const CountdownTimer = ({ initialSeconds }) => {
 const [seconds, setSeconds] = useState(initialSeconds);
 const timerRef = useRef();

 useEffect(() => {
  if (seconds > 0) {
    timerRef.current = setTimeout(() => {
      setSeconds(seconds - 1);
    }, 1000);
  }

  return () => {
    clearTimeout(timerRef.current);
  };
 }, [seconds]);

 return (
  <div>
    <h1>Countdown Timer</h1>
    <p>{seconds}</p>
  </div>
 );
};

export default CountdownTimer;