import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function displayTime(seconds) {
  const d = new Date(seconds * 1000);
  // only show hours if there's more than one hour left on this image
  return d.toISOString().slice(d.getUTCHours() > 0 ? 11 : 14, 19);
}

function startTimer(secondsRemaining, seconds, setSecondsRemaining, setCountdownTimer, onTimeEnded) {
  let currentSecs = secondsRemaining;
  const currentTimerInterval = setInterval(() => {
    setSecondsRemaining(currentSecs - 1);
    currentSecs = currentSecs - 1;
    if (currentSecs === 0) {
      currentSecs = seconds;
      setSecondsRemaining(seconds);
      if (onTimeEnded) {
        onTimeEnded();
      }
    }
  }, 1000);
  setCountdownTimer(currentTimerInterval);
  return currentTimerInterval;
}

function stopTimer(countdownTimer) {
  clearInterval(countdownTimer);
}

function sessionTimer({ seconds, onTimeEnded }) {
  const [showTime, setShowTime] = useState(true);

  const [secondsRemaining, setSecondsRemaining] = useState(seconds);
  const [countdownTimer, setCountdownTimer] = useState(null);

  useEffect(() => {
    const ct = startTimer(seconds, seconds, setSecondsRemaining, setCountdownTimer, () => {
      if (onTimeEnded) {
        onTimeEnded();
      }
    });
    return () => stopTimer(ct);
  }, []);

  return (
    <div
      className="absolute right-0 top-0 z-40 min-w-24 select-none rounded-bl-3xl bg-primary-900 bg-opacity-95 px-5 py-1.5 text-right text-lg"
      style={{ opacity: showTime ? 1 : 0.1 }}
      onClick={() => setShowTime(!showTime)}
    >
      {displayTime(secondsRemaining)}
    </div>
  );
}
sessionTimer.propTypes = {
  seconds: PropTypes.number.isRequired,
  onTimeEnded: PropTypes.func,
};

export default sessionTimer;
