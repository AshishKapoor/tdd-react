import { activate } from "../api/apiCalls";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AccountActivationPage = ({ match }) => {
  const [result, setResult] = useState();
  const { token } = useParams();

  useEffect(() => {
    setResult();
    activate(token || match?.params?.token)
      .then(() => {
        setResult("success");
      })
      .catch(() => setResult("fail"));
  }, [token, match?.params?.token]);

  let content = (
    <span className="spinner-border" role="status"></span>
  );
  if (result === "success") {
    content = (
      <div className="alert alert-success mt-3">Account is activated</div>
    );
  } else if (result === "fail") {
    content = <div className="alert alert-danger mt-3">Activation failure</div>;
  }

  return <div data-testid="account-activation-page">{content}</div>;
};

export default AccountActivationPage;
