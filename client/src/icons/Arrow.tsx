const ArrowIcon = ({ isDown, onClick, className }: any) => {
  const style: any = {
    transform: "scale(1.2)"
  };
  if (isDown) {
    style.transform = style.transform + " rotate(180deg)";
  }

  return (
    <svg
      onClick={onClick}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`music__item--arrow ${className}`}>
      <line x1="12" y1="19" x2="12" y2="5"></line>
      <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
  );
};

export default ArrowIcon;
