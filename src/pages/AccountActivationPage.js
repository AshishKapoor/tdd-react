import { activate } from "../api/apiCalls";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AccountActivationPage = ({ match }) => {
  const [result, setResult] = useState();
  const { token } = useParams();

  useEffect(() => {
    activate(token || match.params.token)
      .then(() => {
        setResult("success");
      })
      .catch(() => setResult("fail"));
  }, [token, match]);

  return (
    <div data-testid="account-activation-page">
      {result === "success" && (
        <div className="alert alert-success mt-3">Account is activated</div>
      )}
      {result === "fail" && (
        <div className="alert alert-danger mt-3">Activation failure</div>
      )}
    </div>
  );
};

export default AccountActivationPage;
