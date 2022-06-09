import { Link } from "react-router-dom";
import defaultProfileImage from "../assets/images/profile.jpg";

const UserListItem = ({ user }) => {
  return (
    <Link
      style={{ textDecoration: "none", color: "#000000" }}
      to={`/user/${user.id}`}
    >
      <li
        className="list-group-item list-group-item-action"
        style={{ cursor: "pointer" }}
      >
        <img
          width="30"
          className="rounded-circle shadow-sm"
          style={{ marginRight: 8 }}
          src={defaultProfileImage}
          alt="Profile"
        />
        {user.username}
      </li>
    </Link>
  );
};

export default UserListItem;
