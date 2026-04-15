import { useState, useCallback } from "react";

/**
 * useState that persists to localStorage.
 * Falls back gracefully when localStorage is unavailable (SSR, private browsing).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const next =
          typeof value === "function"
            ? (value as (prev: T) => T)(storedValue)
            : value;
        setStoredValue(next);
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Fail silently — localStorage may be full or unavailable
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch {
      // Fail silently
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
