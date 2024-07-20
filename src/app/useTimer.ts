import { Dispatch, SetStateAction, useEffect, useState } from "react";

function startTimer(
  secondsRemaining: number,
  secondsList: number[],
  setSecondsList: Dispatch<SetStateAction<number[]>>,
  setSecondsRemaining: Dispatch<SetStateAction<number>>,
  onTimeEnded: (atEndOfTime: boolean) => void,
) {
  let currentSecs = secondsRemaining;
  const currentTimerInterval = setInterval(() => {
    setSecondsRemaining(currentSecs - 1);
    currentSecs = currentSecs - 1;
    if (currentSecs === 0) {
      // if seconds list is empty, repeat the final value
      if (secondsList.length > 1) {
        secondsList.shift();
        setSecondsList(secondsList);
      }
      setSecondsRemaining(secondsList[0]);
      currentSecs = secondsList[0];

      if (onTimeEnded) {
        const atEndOfTime = secondsList.length <= 1;
        onTimeEnded(atEndOfTime);
      }
    }
  }, 1000);
  return currentTimerInterval;
}

export function useTimer(secondsList: number[], running: boolean, onTimeEnded: (atEndOfTime: boolean) => void) {
  secondsList.push(secondsList[secondsList.length - 1]);
  const [secondsRemaining, setSecondsRemaining] = useState(secondsList[0]);
  const [currentSecondsList, setCurrentSecondsList] = useState(secondsList);

  useEffect(() => {
    if (running) {
      const ct = startTimer(
        secondsRemaining,
        currentSecondsList,
        setCurrentSecondsList,
        setSecondsRemaining,
        onTimeEnded,
      );
      return () => clearInterval(ct);
    }
  }, [running]);

  return { secondsRemaining };
}
