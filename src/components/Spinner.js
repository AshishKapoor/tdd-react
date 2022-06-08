const Spinner = ({ size }) => {
  let spanClass = "spinner-border";
  if (size !== "big") {
    spanClass += " spinner-border-sm";
  }
  return <div className={spanClass} role="status" aria-hidden="false"></div>;
};

export default Spinner;
