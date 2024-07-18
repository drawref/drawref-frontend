import { useEffect, useState } from "react";

interface Props {
  seconds: number;
  onTimeEnded?: () => void;
}

function displayTime(seconds: number) {
  const d = new Date(seconds * 1000);
  // only show hours if there's more than one hour left on this image
  return d.toISOString().slice(d.getUTCHours() > 0 ? 11 : 14, 19);
}

function SessionTimer({ seconds, onTimeEnded }: Props) {
  const [showTime, setShowTime] = useState(true);

  return (
    <div
      className="absolute right-0 top-0 z-40 min-w-24 select-none rounded-bl-3xl bg-primary-900 bg-opacity-95 px-5 py-1.5 text-right text-lg"
      style={{ opacity: showTime ? 1 : 0.1 }}
      onClick={() => setShowTime(!showTime)}
    >
      {displayTime(seconds)}
    </div>
  );
}

export default SessionTimer;
