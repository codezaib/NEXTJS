"use client";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";

const CustomProvider = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="min-h-screen grid place-content-center bg-gray-100">
          <div className="h-[500px] rounded-2xl shadow bg-white w-4/5 md:w-[450px] p-4 relative">
            {children}
          </div>
        </div>
        <Footer />
        <ToastContainer />
      </QueryClientProvider>
    </Provider>
  );
};

export default CustomProvider;
