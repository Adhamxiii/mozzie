"use client";

import Loader from "@/components/Loader";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
interface AppProviderType {
  isLoading: boolean;
  authToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    password_confirmation: string
  ) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppProviderType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setAuthToken(token);
    } else {
      router.push("/auth");
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (response.data.status) {
        Cookies.set("token", response.data.token, {
          expires: 7,
        });
        setAuthToken(response.data.token);
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (
    email: string,
    password: string,
    name: string,
    password_confirmation: string
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        name,
        password_confirmation,
      });
      if (response.data.status) {
        Cookies.set("token", response.data.token, {
          expires: 7,
        });
        setAuthToken(response.data.token);
        toast.success("Register successful");
      } else {
        toast.error("Register failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setAuthToken(null);
    router.push("/auth");
    setIsLoading(false);
    toast.success("Logout successful");
  };

  return (
    <AppContext.Provider
      value={{ login, register, isLoading, authToken, logout }}
    >
      {isLoading ? <Loader /> : children}
    </AppContext.Provider>
  );
};

export const useAppHook = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppHook must be used within a AppProvider");
  }
  return context;
};
