import { useState, useRef, useEffect } from "bobril";

export function useDelayed<T>(
  init: T | (() => T),
  timeout: number = 1000
): [delayed: T, setter: (value: T) => void, current: T] {
  const [current, setCurrent] = useState(init);
  const [delayed, setDelayed] = useState(current);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timeoutId.current), []); // clear timeout if the component is unMounted
  function update(newValue: T) {
    setCurrent(newValue);
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => setDelayed(newValue), timeout);
  }
  return [delayed, update, current];
}
