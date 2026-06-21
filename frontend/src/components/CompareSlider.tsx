import { useRef, useState, useCallback, useEffect } from 'react';

interface Props {
  beforeUrl: string;
  afterUrl: string;
  className?: string;
}

/**
 * Слайдер сравнения «до/после». Перетаскивание мышью или пальцем.
 */
export function CompareSlider({ beforeUrl, afterUrl, className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const draggingRef = useRef(false);

  const updateFromX = useCallback((clientX: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    setPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const clientX =
        'touches' in e ? e.touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX;
      updateFromX(clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [updateFromX]);

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden rounded-xl bg-black/40 select-none ${className}`}
      onMouseDown={(e) => {
        draggingRef.current = true;
        updateFromX(e.clientX);
      }}
      onTouchStart={(e) => {
        draggingRef.current = true;
        const x = e.touches[0]?.clientX;
        if (x !== undefined) updateFromX(x);
      }}
    >
      <img src={afterUrl} alt="after" className="block w-full h-full object-cover" draggable={false} />
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={beforeUrl}
          alt="before"
          className="block h-full object-cover"
          style={{ width: `${(100 / pos) * 100}%`, maxWidth: 'none' }}
          draggable={false}
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      />
      <div
        className="absolute w-9 h-9 rounded-full bg-white shadow-md pointer-events-none flex items-center justify-center top-1/2"
        style={{ left: `${pos}%`, transform: 'translate(-50%, -50%)' }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent-600" fill="currentColor">
          <path d="M9 5l-7 7 7 7V5zm6 0v14l7-7-7-7z" />
        </svg>
      </div>
      <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-medium">
        Before
      </div>
      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-medium">
        After
      </div>
    </div>
  );
}
