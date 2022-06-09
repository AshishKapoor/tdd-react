import React, { useEffect, useState } from "react";
import { getUserById } from "../api/apiCalls";
import { useParams } from "react-router-dom";

const UsersPage = ({ match }) => {
  const { id } = useParams();
  const [user, setUser] = useState();

  useEffect(() => {
    async function executeGetUserById(matchId) {
      try {
        const result = await getUserById(id || matchId);
        setUser(result.data);
      } catch (err) {
        throw err;
      }
    }
    executeGetUserById(match?.params?.id);
  }, [match?.params?.id, id]);

  return <div data-testid="users-page">{user?.username}</div>;
};

export default UsersPage;
