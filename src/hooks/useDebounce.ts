import { useState, useEffect, useRef } from "react";

/**
 * Delays updating the returned value until the specified delay has passed
 * since the last change. Use for search inputs, API calls, etc.
 *
 * @param value  - The value to debounce
 * @param delay  - Milliseconds to wait (default: 300ms)
 * @returns      The debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
}
