import IconOptions from "../../types/IconOptions";

const WalletIcon = ({
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
      d="M3 8.5H15C17.8284 8.5 19.2426 8.5 20.1213 9.37868C21 10.2574 21 11.6716 21 14.5V15.5C21 18.3284 21 19.7426 20.1213 20.6213C19.2426 21.5 17.8284 21.5 15 21.5H9C6.17157 21.5 4.75736 21.5 3.87868 20.6213C3 19.7426 3 18.3284 3 15.5V8.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path
      d="M15 8.49833V4.1103C15 3.22096 14.279 2.5 13.3897 2.5C13.1336 2.5 12.8812 2.56108 12.6534 2.67818L3.7623 7.24927C3.29424 7.48991 3 7.97203 3 8.49833"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default WalletIcon;
