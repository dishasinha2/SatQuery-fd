import { useEffect, useRef } from 'react';

export function RocketCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;

    const move = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };
    const setPressed = (pressed: boolean) => document.body.classList.toggle('rocket-cursor--pressed', pressed);
    const press = () => setPressed(true);
    const release = () => setPressed(false);
    const setHover = (event: MouseEvent) => {
      const target = event.target as Element | null;
      document.body.classList.toggle('rocket-cursor--hovering', Boolean(target?.closest('a, button, input, select, textarea, [role="button"], [onclick]')));
    };
    const animate = () => {
      currentX += (targetX - currentX) * 0.32;
      currentY += (targetY - currentY) * 0.32;
      cursorRef.current?.style.setProperty('--rocket-x', `${currentX}px`);
      cursorRef.current?.style.setProperty('--rocket-y', `${currentY}px`);
      frame = window.requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', setHover);
    document.addEventListener('mousedown', press);
    document.addEventListener('mouseup', release);
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', setHover);
      document.removeEventListener('mousedown', press);
      document.removeEventListener('mouseup', release);
      document.body.classList.remove('rocket-cursor--hovering', 'rocket-cursor--pressed');
    };
  }, []);

  return (
    <div ref={cursorRef} className="rocket-cursor" aria-hidden="true">
      <span className="rocket-cursor__flame" />
      <svg className="rocket-cursor__body" viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="cursor-body" x1="32" y1="4" x2="32" y2="54" gradientUnits="userSpaceOnUse"><stop stopColor="#F8FBFF" /><stop offset="1" stopColor="#9FB0D0" /></linearGradient>
          <linearGradient id="cursor-fin" x1="32" y1="34" x2="32" y2="52" gradientUnits="userSpaceOnUse"><stop stopColor="#B9A5FF" /><stop offset="1" stopColor="#6EDCFF" /></linearGradient>
        </defs>
        <path d="M32 4c8 10 12 22 12 36v10H20V40C20 26 24 14 32 4Z" fill="url(#cursor-body)" stroke="#E7F5FF" strokeWidth="1.3" />
        <path d="m20 34-10 16h10V34Zm24 0 10 16H44V34Z" fill="url(#cursor-fin)" stroke="#E7F5FF" strokeWidth="1.2" />
        <circle cx="32" cy="34" r="5" fill="#112343" stroke="#77D9FF" strokeWidth="1.6" /><circle cx="30.3" cy="32.2" r="1.5" fill="#DDF7FF" />
        <path d="M23 50h18v4H23z" fill="#A78BFA" stroke="#E7F5FF" />
      </svg>
    </div>
  );
}
