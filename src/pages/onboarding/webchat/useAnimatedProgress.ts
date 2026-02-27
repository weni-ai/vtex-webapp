import { useEffect, useRef, useState, useCallback } from 'react';

const DEFAULT_DURATION_MS = 2000;
const COMPLETION_DURATION_FACTOR = 0.4;
const MIN_COMPLETION_DURATION_MS = 200;

export interface AnimatedProgressResult {
  step: string;
  progress: number;
}

/**
 * Smoothly interpolates a progress value toward a target using requestAnimationFrame.
 * When the step changes, first completes the outgoing step to 100% before
 * switching to the new step and animating from 0%.
 */
export function useAnimatedProgress(
  targetStep: string,
  targetProgress: number,
  durationMs = DEFAULT_DURATION_MS,
): AnimatedProgressResult {
  const [displayStep, setDisplayStep] = useState(targetStep);
  const [displayProgress, setDisplayProgress] = useState(targetProgress);
  const animValueRef = useRef(targetProgress);
  const rafIdRef = useRef(0);
  const transitioningRef = useRef(false);
  const pendingRef = useRef<{ step: string; progress: number } | null>(null);

  const animate = useCallback(
    (
      from: number,
      to: number,
      duration: number,
      onComplete?: () => void,
    ) => {
      cancelAnimationFrame(rafIdRef.current);

      const delta = to - from;
      if (Math.abs(delta) < 0.01) {
        animValueRef.current = to;
        setDisplayProgress(to);
        onComplete?.();
        return;
      }

      const startTime = performance.now();

      function tick(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = from + delta * eased;

        animValueRef.current = value;
        setDisplayProgress(value);

        if (t < 1) {
          rafIdRef.current = requestAnimationFrame(tick);
        } else {
          animValueRef.current = to;
          setDisplayProgress(to);
          onComplete?.();
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    },
    [],
  );

  useEffect(() => {
    if (targetStep !== displayStep) {
      if (transitioningRef.current) {
        if (pendingRef.current) {
          pendingRef.current.step = targetStep;
          pendingRef.current.progress = targetProgress;
        }
        return;
      }

      transitioningRef.current = true;
      pendingRef.current = { step: targetStep, progress: targetProgress };

      const from = animValueRef.current;
      const delta = 100 - from;
      const completionDuration = Math.max(
        durationMs * COMPLETION_DURATION_FACTOR * (delta / 100),
        MIN_COMPLETION_DURATION_MS,
      );

      animate(from, 100, completionDuration, () => {
        const pending = pendingRef.current!;
        transitioningRef.current = false;
        pendingRef.current = null;
        animValueRef.current = 0;
        setDisplayStep(pending.step);
        setDisplayProgress(0);
      });
      return;
    }

    if (!transitioningRef.current) {
      animate(animValueRef.current, targetProgress, durationMs);
    }
  }, [targetStep, targetProgress, displayStep, durationMs, animate]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafIdRef.current);
  }, []);

  return { step: displayStep, progress: displayProgress };
}
