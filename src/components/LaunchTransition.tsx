import { useEffect, useState } from 'react';

interface LaunchTransitionProps {
  onComplete: () => void;
}

/** A short, one-time launch sequence shown before the landing page is usable. */
export function LaunchTransition({ onComplete }: LaunchTransitionProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealAt = window.setTimeout(() => setLeaving(true), reducedMotion ? 0 : 2450);
    const finishAt = window.setTimeout(onComplete, reducedMotion ? 0 : 3200);

    return () => {
      window.clearTimeout(revealAt);
      window.clearTimeout(finishAt);
    };
  }, [onComplete]);

  return (
    <div className={`launch-transition${leaving ? ' launch-transition--leaving' : ''}`} aria-hidden="true">
      <div className="launch-transition__galaxy" />
      <div className="launch-transition__stars launch-transition__stars--far" />
      <div className="launch-transition__stars launch-transition__stars--near" />
      <div className="launch-transition__sparkle launch-transition__sparkle--one" />
      <div className="launch-transition__sparkle launch-transition__sparkle--two" />
      <div className="launch-transition__sparkle launch-transition__sparkle--three" />
      <div className="launch-transition__moon-scene">
        <div className="launch-transition__halo" />
        <div className="launch-transition__moon launch-transition__moon--left"><i /><b /><em /></div>
        <div className="launch-transition__moon launch-transition__moon--right"><i /><b /><em /></div>
        <div className="launch-transition__crack" />
        <div className="launch-transition__flash" />
        <div className="launch-transition__ring" />
      </div>
      <p className="launch-transition__label">SATQUERY AI <span>•</span> INITIALIZING</p>
    </div>
  );
}
