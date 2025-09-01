import { createContext, useContext, useState, useEffect } from "react";
// import {
//   Login,
//   Logout,
//   GetCurrentUser,
//   GetCurrentToken,
//   IsTokenExpired,
// } from "../apis/auth/Auth";
import {
  Login,
  Logout,
  GetCurrentUser,
  GetCurrentToken,
  IsTokenExpired,
} from "../apis/Auth/Auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = GetCurrentToken();
    const currentUser = GetCurrentUser();
    console.log(token, currentUser, IsTokenExpired(token));
    if (token && currentUser) {
      if (IsTokenExpired(token)) {
        Logout();
        setUser(null);
      } else {
        setUser(currentUser);
      }
    }

    setLoading(false);
  }, []);

  const handleLogin = async (username, password) => {
    await Login({
      user_name: username,
      password,
      role: "deliveryorganization",
    });
    setUser(GetCurrentUser());
  };

  const handleLogout = () => {
    Logout();
    setUser(null);
  };

  const value = {
    user,
    login: handleLogin,
    logout: handleLogout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
