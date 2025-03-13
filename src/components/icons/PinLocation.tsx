import IconOptions from "../../types/IconOptions";

const PinLocationIcon = ({
  width = 20,
  height = 20,
  color = "#0475f5",
  className,
}: IconOptions) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    color={color}
    fill={"none"}
    className={className}
  >
    <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5 16C3.7492 16.6327 3 17.4385 3 18.3158C3 20.3505 7.02944 22 12 22C16.9706 22 21 20.3505 21 18.3158C21 17.4385 20.2508 16.6327 19 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 10L12 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default PinLocationIcon;
