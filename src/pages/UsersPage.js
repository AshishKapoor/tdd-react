import { useParams } from "react-router-dom";

const UsersPage = () => {
  const { id } = useParams();
  return (
    <div data-testid="users-page">
      <h1>User Page {id}</h1>
    </div>
  );
};

export default UsersPage;
