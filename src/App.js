import { createBrowserHistory } from "history";
import {
  Route,
  Routes,
  unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";
import LanguageSelector from "./components/LanguageSelector";
import AccountActivationPage from "./pages/AccountActivationPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UserPage from "./pages/UserPage";
import NavBar from "./components/NavBar";

function App() {
  const history = createBrowserHistory({ window });

  return (
    <HistoryRouter history={history}>
      <NavBar />
      <div className="container pt-3">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage history={history} />} />
          <Route path="/user/:id" element={<UserPage />} />
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
