import { useState, useEffect } from "react";
import { readStoredState } from "../utils/storedState";
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => readStoredState(key, initial));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Browsers can disable storage; the current session still works. */
    }
  }, [key, value]);
  return [value, setValue];
}
