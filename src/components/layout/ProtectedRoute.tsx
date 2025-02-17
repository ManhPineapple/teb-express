import React from "react";
import { useStore } from "zustand";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const ProtectedRoute = ({ children }: any) => {
  const navigate = useNavigate();
  const isLoggedIn = useStore(useAuthStore, (state) => state.isLoggedIn);

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? children : null;
};

export default ProtectedRoute;
