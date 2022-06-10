import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import logoImage from "../assets/images/logo512.png";
import { AuthContext } from "../App";
import { useContext } from "react";

const NavBar = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

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
              {t("myProfile")}
            </NavLink>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
