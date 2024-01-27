import { useState } from "react";

// Only set state after `ms` milliseconds have passed.
// This can be used to reduce API calls or other changes.
export function useDebouncedState(initialState, ms) {
  const [value, setValueDirectly] = useState(initialState);

  var timer;
  const setValue = (newValueOrFunc) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setValueDirectly(newValueOrFunc);
    }, ms);
  };
  return [value, setValue];
}
