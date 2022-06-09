import Spinner from "./Spinner";

const ButtonWithProgress = ({ disabled, apiProgress, onClick, children }) => {
  return (
    <button
      className="btn btn-primary"
      disabled={disabled || apiProgress}
      onClick={onClick}
    >
      {apiProgress && <Spinner />}
      {children}
    </button>
  );
};

export default ButtonWithProgress;
