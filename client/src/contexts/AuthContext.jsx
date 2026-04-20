import { createContext, useState, useEffect } from "react";
import { setToken, clearToken } from "../components/tokenService/tokenService.jsx";
import api from "../components/Api/Api.jsx";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAccessToken = (token) => {
    setAccessTokenState(token);
    setToken(token);
  };

  const logout = () => {
    setAccessTokenState(null);
    clearToken();
  };

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await api.post("/auth/refresh");
        setAccessToken(response.data.accessToken);
      } catch (err) {
        console.log("User not logged in");
      } finally {
        setLoading(false);
      }
    };

    refreshToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        logout,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;