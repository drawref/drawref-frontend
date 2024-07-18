import { useState } from "react";

// Only set state after `ms` milliseconds have passed.
// This can be used to reduce API calls or other changes.
export function useDebouncedState(initialState: any, ms: number) {
  const [value, setValueDirectly] = useState(initialState);
  const [isWaiting, setIsWaiting] = useState(false);

  var timer: NodeJS.Timeout;
  const setValue = (newValueOrFunc: any) => {
    setIsWaiting(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      setValueDirectly(newValueOrFunc);
      setIsWaiting(false);
    }, ms);
  };
  return [value, setValue, isWaiting];
}
