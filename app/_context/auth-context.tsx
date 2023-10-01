"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export interface UserState {
  user: {
    id: string | null;
    email: string;
    password: string;
    isAdmin: Boolean | null;
  } | null;
  loading: Boolean;
  isAuthenticated: Boolean;
  signin: (user: { email: string; password: string }) => {};
  signup: (user: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {};
  logout: () => {};
}

const defaultState: UserState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  signin: async () => {},
  signup: async () => {},
  logout: async () => {},
};

export const authContext = createContext<UserState>(defaultState);

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<null | {
    id: string;
    email: string;
    password: string;
    isAdmin: Boolean;
  }>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {}, []);

  const signin = async (user: { email: string; password: string }) => {
    try {
      const res = await axios.post("/api/auth/signin", user);
      console.log(res.data);
      setIsAuthenticated(true);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const signup = async (user: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      // const res = await registerRequest(user);
      const res = await axios.post("/api/auth/signup", user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signin,
    signup,
    logout,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
