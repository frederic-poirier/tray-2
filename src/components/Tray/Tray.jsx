import { createSignal, createEffect, onMount, onCleanup, children } from 'solid-js';
import './Tray.css';

export const TrayPosition = {
  Docked: 2,
  Open: 3,
  Expanded: 4,
  Scrolling: 5,
};

const TRAY_TOP_MARGIN = 24;
const TRAY_PEEK_HEIGHT = 70;
const TRAY_OPEN_HEIGHT = 320;

export function Tray(props) {
  let wrapperRef;
  
  const [position, setPosition] = createSignal(TrayPosition.Docked);
  const [isSliding, setIsSliding] = createSignal(false);
  
  const resolvedBackdrop = children(() => props.backdrop);
  const resolvedChildren = children(() => props.children);
  
  const getSnapPositions = () => {
    if (!wrapperRef) return { docked: 0, open: 250, expanded: 0 };
    const vh = wrapperRef.clientHeight;
    return {
      docked: 0,
      open: TRAY_OPEN_HEIGHT - TRAY_PEEK_HEIGHT,
      expanded: vh - TRAY_PEEK_HEIGHT - TRAY_TOP_MARGIN,
    };
  };
  
  const calculatePosition = () => {
    if (!wrapperRef) return TrayPosition.Docked;
    
    const scrollTop = wrapperRef.scrollTop;
    const snaps = getSnapPositions();
    
    if (scrollTop < (snaps.docked + snaps.open) / 2) {
      return TrayPosition.Docked;
    }
    if (scrollTop < (snaps.open + snaps.expanded) / 2) {
      return TrayPosition.Open;
    }
    if (scrollTop <= snaps.expanded + 50) {
      return TrayPosition.Expanded;
    }
    return TrayPosition.Scrolling;
  };
  
  const handleScroll = () => {
    if (isSliding()) return;
    const newPos = calculatePosition();
    if (newPos !== position()) {
      setPosition(newPos);
    }
  };
  
  const scrollToPosition = (targetPosition, smooth = true) => {
    if (!wrapperRef) return Promise.resolve();
    
    const snaps = getSnapPositions();
    let targetScroll;
    
    switch (targetPosition) {
      case TrayPosition.Docked:
        targetScroll = snaps.docked;
        break;
      case TrayPosition.Open:
        targetScroll = snaps.open;
        break;
      case TrayPosition.Expanded:
        targetScroll = snaps.expanded;
        break;
      default:
        return Promise.resolve();
    }
    
    if (!smooth) {
      wrapperRef.scrollTop = targetScroll;
      setPosition(targetPosition);
      return Promise.resolve();
    }
    
    setIsSliding(true);
    wrapperRef.scrollTo({ top: targetScroll, behavior: 'smooth' });
    
    return new Promise((resolve) => {
      let lastScroll = -1;
      let stableCount = 0;
      
      const check = () => {
        const curr = wrapperRef.scrollTop;
        if (Math.abs(curr - targetScroll) < 2) {
          setIsSliding(false);
          setPosition(targetPosition);
          resolve();
          return;
        }
        if (curr === lastScroll) {
          stableCount++;
          if (stableCount > 8) {
            setIsSliding(false);
            setPosition(calculatePosition());
            resolve();
            return;
          }
        } else {
          stableCount = 0;
        }
        lastScroll = curr;
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    });
  };
  
  const cyclePosition = () => {
    const curr = position();
    if (curr === TrayPosition.Docked) scrollToPosition(TrayPosition.Open);
    else if (curr === TrayPosition.Open) scrollToPosition(TrayPosition.Expanded);
    else scrollToPosition(TrayPosition.Docked);
  };
  
  onMount(() => {
    if (wrapperRef) {
      wrapperRef.scrollTop = 0;
      setPosition(TrayPosition.Docked);
    }
    wrapperRef?.addEventListener('scroll', handleScroll, { passive: true });
  });
  
  onCleanup(() => {
    wrapperRef?.removeEventListener('scroll', handleScroll);
  });
  
  createEffect(() => {
    if (props.ref) {
      props.ref({ scrollToPosition, cyclePosition, getPosition: () => position() });
    }
  });
  
  return (
    <div class="tray-root">
      {/* Backdrop - fixed behind everything */}
      <div class="tray-backdrop">
        {resolvedBackdrop()}
      </div>
      
      {/* Scroll container for tray - overlays backdrop */}
      <div
        ref={wrapperRef}
        class="tray-wrapper"
        classList={{
          'sliding': isSliding(),
          [`tray-pos-${position()}`]: true,
        }}
      >
        {/* Spacer for docked position */}
        <div class="tray-spacer tray-spacer-docked" />
        
        {/* Spacer for open position */}
        <div class="tray-spacer tray-spacer-open" />
        
        {/* The card area */}
        <div class="tray-sheet">
          {resolvedChildren()}
        </div>
      </div>
    </div>
  );
}

export default Tray;
