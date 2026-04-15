import { createContext, useState } from "react";
import { setToken, clearToken } from "../components/tokenService/tokenService.jsx";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(null);

  const setAccessToken = (token) => {
    setAccessTokenState(token);
    setToken(token);
  };

  const logout = () => {
    setAccessTokenState(null);
    clearToken();
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;