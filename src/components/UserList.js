import React from "react";
import { loadUsers } from "../api/apiCalls";

class UserList extends React.Component {
  state = {
    page: {
      content: [],
      page: 0,
      size: 0,
      totalPages: 0,
    },
  };

  componentDidMount() {
    loadUsers().then((response) => {
      this.setState({ page: response.data });
    });
  }
  render() {
    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>Users</h3>
        </div>
        {this.state.page.content.map((user) => (
          <li className="list-group-item list-group-item-action" key={user.id}>{user.username}</li>
        ))}
      </div>
    );
  }
}

export default UserList;
