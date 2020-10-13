import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { AuthData } from "../types";
import { getCurrentUser } from "../api/queries";

const cookies = new Cookies();

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
 
  useEffect(() => {
    currentUser().then((user) => {
      if (!user) {
        console.log("User logged out");
        clearAuthData();
      }
    });

    const authData: AuthData = cookies.get("auth_data");

    const isAuthenticated = !!authData;
    const userType = isAuthenticated ? authData.type : "unauthenticated";
    const username = isAuthenticated ? authData.username : "";
    const userId = isAuthenticated ? authData.userId : ""

    setIsAuthenticated(isAuthenticated);
    setIsAdmin(userType == "admin");
    setUsername(username);
    setUserId(userId);
  }, []);

  const currentUser = () => {
    return new Promise(async (resolve) => {
      try {
        const user = await getCurrentUser();
        resolve(user);
      } catch (err) {
        resolve(null);
      }
    });
  };

  const setAuthData = (authData: AuthData) => {
    cookies.set("auth_data", authData);
  };

  const clearAuthData = () => {
    cookies.remove("auth_data");
    setIsAuthenticated(false);
    setUsername("");
    setUserId("")
  };

  return { isAuthenticated, isAdmin, setAuthData, clearAuthData, username, userId };
};

export default useAuth;