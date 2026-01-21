import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { instance } from "../axiosConfig";
export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await instance.get("/user/checkToken");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading , fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
