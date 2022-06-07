import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LanguageSelector from "./components/LanguageSelector";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import { useTranslation } from "react-i18next";
import { useState } from "react";

function App() {
  const { t } = useTranslation();
  const [path, setPath] = useState(window.location.pathname);

  const onClickLink = (event) => {
    event.preventDefault();
    const path = event.target.attributes.href.value;
    window.history.pushState({}, "", path);
    setPath(path);
  };

  return (
    <div className="container">
      <div>
        <a href="/" title="Home" onClick={onClickLink}>
          Hoaxify
        </a>
        <a href="/signup" title="Sign Up" onClick={onClickLink}>
          {t("signUp")}
        </a>
      </div>
      {path === "/" && <HomePage />}
      {path === "/signup" && <SignUpPage />}
      {path === "/login" && <LoginPage />}
      {path.startsWith("/user/") && <UserPage />}
      <LanguageSelector />
    </div>
  );
}

export default App;
