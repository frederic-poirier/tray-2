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
  let backdropRef;
  let sheetRef;
  
  const [position, setPosition] = createSignal(TrayPosition.Docked);
  const [isSliding, setIsSliding] = createSignal(false);
  // Track the visible card height to set clip-path
  const [cardTop, setCardTop] = createSignal(0);
  
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
  
  // Update the clip-path based on where the card is
  const updateCardTop = () => {
    if (!sheetRef || !wrapperRef) return;
    const sheetRect = sheetRef.getBoundingClientRect();
    setCardTop(Math.max(0, sheetRect.top));
  };
  
  const handleScroll = () => {
    updateCardTop();
    
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
      updateCardTop();
      return Promise.resolve();
    }
    
    setIsSliding(true);
    wrapperRef.scrollTo({ top: targetScroll, behavior: 'smooth' });
    
    return new Promise((resolve) => {
      let lastScroll = -1;
      let stableCount = 0;
      
      const check = () => {
        updateCardTop();
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
      // Initial card top calculation
      requestAnimationFrame(updateCardTop);
    }
    
    wrapperRef?.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateCardTop);
  });
  
  onCleanup(() => {
    wrapperRef?.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateCardTop);
  });
  
  createEffect(() => {
    if (props.ref) {
      props.ref({ scrollToPosition, cyclePosition, getPosition: () => position() });
    }
  });
  
  // Dynamic clip-path style to only capture touches on the card area
  const wrapperStyle = () => ({
    'clip-path': `inset(${cardTop()}px 0 0 0)`,
    '-webkit-clip-path': `inset(${cardTop()}px 0 0 0)`,
  });
  
  return (
    <div class="tray-root">
      {/* Backdrop - fixed behind everything, fully interactive */}
      <div ref={backdropRef} class="tray-backdrop">
        {resolvedBackdrop()}
      </div>
      
      {/* Scroll container - clipped to only the card area */}
      <div
        ref={wrapperRef}
        class="tray-wrapper"
        style={wrapperStyle()}
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
        <div ref={sheetRef} class="tray-sheet">
          {resolvedChildren()}
        </div>
      </div>
    </div>
  );
}

export default Tray;
