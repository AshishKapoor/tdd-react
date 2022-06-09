import { createBrowserHistory } from "history";
import { useTranslation } from "react-i18next";
import {
  NavLink,
  Route,
  Routes, unstable_HistoryRouter as HistoryRouter
} from "react-router-dom";
import logoImage from "./assets/images/logo512.png";
import LanguageSelector from "./components/LanguageSelector";
import AccountActivationPage from "./pages/AccountActivationPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UsersPage from "./pages/UsersPage";

function App() {
  const { t } = useTranslation();
  const history = createBrowserHistory({ window });

  return (
    <HistoryRouter history={history}>
      <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
        <div className="container">
          <NavLink className="navbar-brand" to="/" title="Home">
            <img width="60" src={logoImage} alt="React with TDD" />
            React with TDD
          </NavLink>
          <ul className="navbar-nav">
            <NavLink className="nav-link" to="/signup">
              {t("signUp")}
            </NavLink>
            <NavLink className="nav-link" to="/login">
              {t("login")}
            </NavLink>
            {/* Testing Account Activation */}
            {/* <NavLink className="nav-link" to="/activate/1">
              Activate 1
            </NavLink> */}
          </ul>
        </div>
      </nav>
      <div className="container pt-3">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage history={history}/>} />
          <Route path="/user/:id" element={<UsersPage />} />
          <Route path="/activate/:token" element={<AccountActivationPage />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
        <LanguageSelector />
      </div>
    </HistoryRouter>
  );
}

const NoMatch = () => {
  return (
    <main style={{ padding: "1rem" }}>
      <p>There's nothing here!</p>
    </main>
  );
};

export default App;
