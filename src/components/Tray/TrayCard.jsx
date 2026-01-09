import { children } from 'solid-js';

export function TrayCard(props) {
  const resolvedHeader = children(() => props.header);
  const resolvedChildren = children(() => props.children);
  
  // Handle click cycles through positions
  const handleClick = (e) => {
    // Don't trigger on links or buttons within the handle
    if (e.target.closest('a, button')) return;
    
    // Call the onHandleClick prop if provided
    props.onHandleClick?.();
  };
  
  return (
    <div class="tray-card">
      {/* Sticky handle */}
      <div class="tray-card-handle" onClick={handleClick}>
        <div class="tray-card-handle-bar" />
      </div>
      
      {/* Sticky header - becomes snap target when expanded */}
      <div class="tray-card-header">
        {resolvedHeader()}
      </div>
      
      {/* Scrollable content */}
      <div class="tray-card-content">
        {resolvedChildren()}
      </div>
    </div>
  );
}

export default TrayCard;
