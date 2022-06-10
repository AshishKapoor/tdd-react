import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/apiCalls";
import Alert from "../components/Alert";
import ProfileCard from "../components/ProfileCard";
import Spinner from "../components/Spinner";
import { AuthContext } from "../App";

const UserPage = ({ match }) => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [failResponse, setFailResponse] = useState(undefined);
  const auth = useContext(AuthContext);

  useEffect(() => {
    setPendingApiCall(true);
    async function executeGetUserById(matchId) {
      try {
        const result = await getUserById(id || matchId);
        setUser(result.data);
      } catch (err) {
        setFailResponse(err.response.data.message);
      }
      setPendingApiCall(false);
    }
    executeGetUserById(match?.params?.id);
  }, [match?.params?.id, id]);

  let content = (
    <Alert type="secondary" center>
      <Spinner size="big" />
    </Alert>
  );
  if (!pendingApiCall) {
    if (failResponse) {
      content = (
        <Alert type="danger" center>
          {failResponse}
        </Alert>
      );
    } else {
      content = <ProfileCard user={user} />;
    }
  }

  return (
    <div data-testid="user-page">
      <pre>{JSON.stringify(auth, null, 2)}</pre> {content}
    </div>
  );
};

export default UserPage;
