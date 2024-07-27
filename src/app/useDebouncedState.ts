import { useState } from "react";

// Only set state after `ms` milliseconds have passed.
// This can be used to reduce API calls or other changes.
export function useDebouncedState<Type>(
  initialState: Type,
  ms: number,
): [Type, (newValueOrFunc: Type) => void, boolean] {
  const [value, setValueDirectly] = useState<Type>(initialState);
  const [isWaiting, setIsWaiting] = useState(false);

  var timer: ReturnType<typeof setTimeout>;
  const setValue = (newValueOrFunc: Type) => {
    setIsWaiting(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      setValueDirectly(newValueOrFunc);
      setIsWaiting(false);
    }, ms);
  };
  return [value, setValue, isWaiting];
}
