"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Main from "@/components/Main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "@/store";
export default function Home() {
  const client = new QueryClient();
  return (
    <Provider store={store}>
      <Header />
      <QueryClientProvider client={client}>
        <Main />
      </QueryClientProvider>
      <Footer />
      <ToastContainer />
    </Provider>
  );
}
