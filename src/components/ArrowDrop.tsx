export function ArrowDrop({ isDown, style }: { isDown: boolean, style?: React.CSSProperties | undefined }) {
  return (
    <svg
      data-testid="arrow-drop"
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      style={{
        transform: `rotate(${isDown ? 180 : 0}deg)`,
        ...style,
      }}
      transform={"rotate(180deg)"}
    >
      <g mask="url(#a)">
        <path
          fill="currentColor"
          d="M7.234 11.458a.35.35 0 0 1-.273-.114.383.383 0 0 1-.104-.266c0-.025.04-.113.117-.264L9.6 8.188a.532.532 0 0 1 .4-.174.531.531 0 0 1 .4.174l2.626 2.626a.426.426 0 0 1 .085.122.381.381 0 0 1-.072.41.353.353 0 0 1-.273.112H7.234Z"
        />
      </g>
    </svg>
  );
}
