import { useEffect, useCallback, useRef } from 'react';

export const useInactivityTimer = (timeout, onTimeout, enabled) => {
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (enabled) {
      timerRef.current = window.setTimeout(() => {
        onTimeout();
      }, timeout);
    }
  }, [timeout, onTimeout, enabled]);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
    const handleActivity = () => resetTimer();

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });
    
    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resetTimer, enabled]);

  return { resetTimer };
};