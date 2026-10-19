import { useState, useEffect } from "react";
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      return Array.isArray(saved) ? saved : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Browsers can disable storage; the current session still works. */
    }
  }, [key, value]);
  return [value, setValue];
}
