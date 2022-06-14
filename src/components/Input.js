const Input = (props) => {
  const { id, label, onChange, help, type } = props;
  let inputClass = "form-control";
  if (help) {
    inputClass += " is-invalid";
  }
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        data-testid="input"
        className={inputClass}
        id={id}
        onChange={onChange}
        type={type}
      />
      {help && <span data-testid="span" className="invalid-feedback">{help}</span>}
    </div>
  );
};

export default Input;
