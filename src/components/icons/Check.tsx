import IconOptions from "../../types/IconOptions";

const CheckIcon = ({
  width = 20,
  height = 20,
  color = "#0B798B",
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
    <path
      d="M5 14L8.5 17.5L19 6.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CheckIcon;
