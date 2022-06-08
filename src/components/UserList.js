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
  loadNext = () => {
    loadUsers(this.state.page.page + 1).then((response) => {
      this.setState({ page: response.data });
    });
  };
  loadPrevious = () => {
    loadUsers(this.state.page.page - 1).then((response) => {
      this.setState({ page: response.data });
    });
  };

  render() {
    const { totalPages, page, content } = this.state.page;
    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>Users</h3>
        </div>
        <ul className="list-group list-group-flush">
          {content.map((user) => {
            return (
              <li
                key={user.id}
                className="list-group-item list-group-item-action"
              >
                {user.username}
              </li>
            );
          })}
        </ul>
        {page !== 0 && (
          <button onClick={this.loadPrevious}>&lt; previous</button>
        )}
        {totalPages > page + 1 && (
          <button onClick={this.loadNext}>next &gt;</button>
        )}
      </div>
    );
  }
}

export default UserList;
