const Alert = ({ children, type, center }) => {
  let classForAlert = `alert alert-${type}`;
  if (center) {
    classForAlert += " text-center";
  }
  return (
    <div className={classForAlert}>
      {children}
    </div>
  );
};

Alert.defaultProps = {
  type: "success",
};

export default Alert;
