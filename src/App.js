import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
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

  return (
    <Router>
      <nav className="navbar navbar-expand navbar-light bg-light shadow">
        <div className="container">
          <NavLink className="navbar-brand" to="/" title="Home">
            <img width="60" src={logoImage} alt="Hoaxify" />
            Hoaxify
          </NavLink>
          <ul className="navbar-nav">
            <NavLink className="nav-link" to="/signup">
              {t("signUp")}
            </NavLink>
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          </ul>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/users/:id" element={<UsersPage />} />
          {/* <Route path="/activate/:token" element={(props) => <AccountActivationPage {...props} />} /> */}
          {/* with hooks */}
          <Route path="/activate/:token" element={<AccountActivationPage />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
        <LanguageSelector />
      </div>
    </Router>
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
