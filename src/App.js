import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LanguageSelector from "./components/LanguageSelector";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div className="container">
      {window.location.pathname === '/' && <HomePage />}
      {window.location.pathname === '/signup' && <SignUpPage />}
      {window.location.pathname === '/login' && <LoginPage />}
      <LanguageSelector />
    </div>
  );
}

export default App;
