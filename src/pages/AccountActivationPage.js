import { activate } from "../api/apiCalls";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

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
  }, [match?.params?.token, token]);

  let content = (
    <Alert type="secondary" center>
      <Spinner size="big" />
    </Alert>
  );
  if (result === "success") {
    content = <Alert type="success">Account is activated</Alert>;
  } else if (result === "fail") {
    content = <Alert type="danger">Activation failure</Alert>;
  }

  return <div data-testid="account-activation-page">{content}</div>;
};

export default AccountActivationPage;
