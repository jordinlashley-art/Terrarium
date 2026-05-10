import { useEffect, useRef } from 'react';
import { TimeScale } from '../types/ecosystem';
import { TICK_INTERVAL_MS } from '../constants/ecosystem';

/**
 * Delta-time game loop using requestAnimationFrame.
 *
 * The loop fires `onTick` at a rate determined by the base `TICK_INTERVAL_MS`
 * divided by `timeScale`, so 5x speed halves the interval, 10x divides it by 10.
 * This approach keeps the simulation consistent regardless of display framerate.
 */
export function useGameLoop(
  running: boolean,
  timeScale: TimeScale,
  onTick: () => void,
) {
  const rafRef = useRef<number>(0);
  const lastTickTimeRef = useRef<number>(0);
  const onTickRef = useRef(onTick);

  // Keep the callback ref current so the loop always calls the latest version
  // without needing to be restarted when onTick identity changes.
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const tickInterval = TICK_INTERVAL_MS / timeScale;

    function loop(timestamp: number) {
      // First frame: initialise the reference time
      if (lastTickTimeRef.current === 0) {
        lastTickTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTickTimeRef.current;

      if (elapsed >= tickInterval) {
        // Calculate how many ticks should have fired during this elapsed time.
        // Normally this is 1, but if the tab was backgrounded it could be more.
        const ticks = Math.floor(elapsed / tickInterval);
        for (let i = 0; i < ticks; i++) {
          onTickRef.current();
        }
        lastTickTimeRef.current = timestamp - (elapsed % tickInterval);
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    // Reset last tick time when the loop starts fresh
    lastTickTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [running, timeScale]);
}
