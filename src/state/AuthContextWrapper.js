import { useState, createContext } from "react";

export const AuthContext = createContext();

function AuthContextWrapper({ children }) {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    id: "",
  });

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        onLoginSuccess: setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextWrapper;