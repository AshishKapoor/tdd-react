import React from "react";
import { withTranslation } from "react-i18next";
import { loadUsers } from "../api/apiCalls";
import Spinner from "../components/Spinner";
import UserListItem from "./UserListItem";

class UserList extends React.Component {
  state = {
    page: {
      content: [],
      page: 0,
      size: 0,
      totalPages: 0,
    },
    pendingApiCall: false,
  };

  componentDidMount() {
    this.loadData();
  }
  loadData = async (pageIndex) => {
    this.setState({ pendingApiCall: true });
    try {
      await loadUsers(pageIndex).then((response) => {
        this.setState({ page: response.data });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.setState({ pendingApiCall: false });
  };

  render() {
    const { pendingApiCall } = this.state;
    const { totalPages, page, content } = this.state.page;
    const { t } = this.props;
    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>{t("users")}</h3>
        </div>
        <ul className="list-group list-group-flush">
          {content.map((user) => {
            return <UserListItem key={user.id} user={user} />;
          })}
        </ul>
        <div className="card-footer text-center">
          {page !== 0 && !pendingApiCall && (
            <button
              className="btn btn-outline-secondary btn-sm float-start"
              onClick={() => this.loadData(page - 1)}
            >
              {t("previousPage")}
            </button>
          )}
          {totalPages > page + 1 && !pendingApiCall && (
            <button
              className="btn btn-outline-secondary btn-sm float-end"
              onClick={() => this.loadData(page + 1)}
            >
              {t("nextPage")}
            </button>
          )}
          {pendingApiCall && <Spinner />}
        </div>
      </div>
    );
  }
}

export default withTranslation()(UserList);
