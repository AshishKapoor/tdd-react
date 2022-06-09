import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import logoImage from "../assets/images/logo512.png";

const NavBar = ({ auth }) => {
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand" to="/" title="Home">
          <img width="60" src={logoImage} alt="React with TDD" />
          React with TDD
        </NavLink>
        <ul className="navbar-nav">
          {!auth.isLoggedIn && (
            <>
              <NavLink className="nav-link" to="/signup">
                {t("signUp")}
              </NavLink>
              <NavLink className="nav-link" to="/login">
                {t("login")}
              </NavLink>
            </>
          )}
          {auth.isLoggedIn && (
            <NavLink className="nav-link" to={`/user/${auth.id}`}>
              My Profile
            </NavLink>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
