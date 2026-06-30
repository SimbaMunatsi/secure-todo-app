import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const payload = new URLSearchParams();
    payload.append("username", email);
    payload.append("password", password);

    const tokenResponse = await api.post("/auth/login", payload);
    const token = tokenResponse.data?.access_token;
    if (!token) {
      throw new Error("Authentication failed");
    }

    localStorage.setItem("token", token);
    const profileResponse = await api.get("/users/me");
    setUser(profileResponse.data);
    return profileResponse.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
