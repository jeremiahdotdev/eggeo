export function UserMarker({ size = 38, strokeWidth = 2 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg aria-label="Your location" height={size} role="img" viewBox="0 0 100 100" width={size} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="15" fill="none" stroke="#0074D9" strokeWidth={strokeWidth} />
      <circle cx="50" cy="50" r="15" fill="none" stroke="#0074D9" strokeOpacity="0.5" strokeWidth={strokeWidth}>
        <animate attributeName="r" dur="2s" repeatCount="indefinite" values="15;35;15" />
        <animate attributeName="stroke-opacity" dur="2s" repeatCount="indefinite" values="0.5;0;0.5" />
      </circle>
      <circle cx="50" cy="50" r="5" fill="#0074D9" />
      <circle cx="50" cy="50" r="5" fill="#0074D9" stroke="#0074D9" strokeOpacity="1" strokeWidth={strokeWidth}>
        <animate attributeName="r" dur="2s" repeatCount="indefinite" values="10;20;10" />
        <animate attributeName="stroke-opacity" dur="2s" repeatCount="indefinite" values="1;0;1" />
      </circle>
    </svg>
  );
}
