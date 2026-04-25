import { useEffect, useRef, useState } from "react";

interface ScrollPillProps {
  /**
   * Ref to the scrollable element that this pill should track.
   * The pill renders inside that element's nearest positioned ancestor,
   * so the ancestor must be `relative`.
   */
  targetRef: React.RefObject<HTMLElement>;
}

/**
 * iPhone-style overlay scroll indicator.
 * - No track / no background behind it
 * - Only appears while the user is scrolling
 * - Fades out shortly after scrolling stops
 */
const ScrollPill = ({ targetRef }: ScrollPillProps) => {
  const pillRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);
  const [metrics, setMetrics] = useState<{ height: number; top: number; show: boolean }>({
    height: 0,
    top: 0,
    show: false,
  });

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const compute = () => {
      const { scrollHeight, clientHeight, scrollTop } = el;
      if (scrollHeight <= clientHeight + 1) {
        setMetrics({ height: 0, top: 0, show: false });
        return;
      }
      const minPill = 28;
      const trackPadding = 8; // keep pill away from rounded corners
      const usableTrack = clientHeight - trackPadding * 2;
      const ratio = clientHeight / scrollHeight;
      const pillHeight = Math.max(minPill, usableTrack * ratio);
      const maxTop = usableTrack - pillHeight;
      const scrollRatio = scrollTop / (scrollHeight - clientHeight);
      const top = trackPadding + maxTop * scrollRatio;
      setMetrics({ height: pillHeight, top, show: true });
    };

    const showAndScheduleHide = () => {
      compute();
      setVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => setVisible(false), 700);
    };

    const onScroll = () => showAndScheduleHide();

    const resizeObserver = new ResizeObserver(() => {
      compute();
    });
    resizeObserver.observe(el);

    el.addEventListener("scroll", onScroll, { passive: true });
    compute();

    return () => {
      el.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [targetRef]);

  if (!metrics.show) return null;

  return (
    <div
      ref={pillRef}
      className="ios-scroll-pill"
      data-visible={visible ? "true" : "false"}
      style={{
        height: `${metrics.height}px`,
        top: `${metrics.top}px`,
      }}
      aria-hidden="true"
    />
  );
};

export default ScrollPill;
