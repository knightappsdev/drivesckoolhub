'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseExitIntentOptions {
  threshold?: number;
  delay?: number;
  onExitIntent?: () => void;
}

export const useExitIntent = (options: UseExitIntentOptions = {}) => {
  const { threshold = 10, delay = 100, onExitIntent } = options;
  const [hasTriggered, setHasTriggered] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger if mouse is leaving from the top of the viewport
    if (e.clientY <= threshold && !hasTriggered) {
      setTimeout(() => {
        if (!hasTriggered) {
          setHasTriggered(true);
          onExitIntent?.();
        }
      }, delay);
    }
  }, [threshold, delay, hasTriggered, onExitIntent]);

  const handleMouseEnter = useCallback(() => {
    // Optional: Reset trigger when mouse re-enters (for testing)
    // Uncomment if you want to allow multiple triggers
    // setHasTriggered(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [handleMouseLeave, handleMouseEnter]);

  const resetTrigger = useCallback(() => {
    setHasTriggered(false);
  }, []);

  const trigger = useCallback(() => {
    if (!hasTriggered) {
      setHasTriggered(true);
      onExitIntent?.();
    }
  }, [hasTriggered, onExitIntent]);

  return {
    hasTriggered,
    resetTrigger,
    trigger
  };
};