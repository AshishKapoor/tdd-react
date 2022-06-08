import { activate } from "../api/apiCalls";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

const AccountActivationPage = ({ match }) => {
  const [result, setResult] = useState();
  const { token } = useParams();

  useEffect(() => {
    async function activateRequest() {
      setResult();
      try {
        await activate(token || match?.params?.token);
        setResult("success");
      } catch (error) {
        setResult("fail");
      }
    }
    activateRequest();
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
