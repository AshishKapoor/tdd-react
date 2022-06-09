import React, { useEffect, useState } from "react";
import { getUserById } from "../api/apiCalls";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

const UsersPage = ({ match }) => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [failResponse, setFailResponse] = useState(undefined);

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

  return <div data-testid="users-page">{content}</div>;
};

export default UsersPage;
