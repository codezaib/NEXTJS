import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { setUser } from "@/features/User";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Login = () => {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: async (data) => {
      try {
        const { data: response } = await axios.post("/api/v1/auth/login", {
          ...data,
        });
        return response.data;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data) {
        toast.success("Login successful!");
        setUser(data);
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    },
  });
  const submitForm = (data) => {
    mutate(data);
  };
  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="flex flex-col h-full justify-center"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      <input
        {...register("phone", {
          required: "Phone Number is required",
          pattern: {
            value: /^03\d{2}\s\d{7}$/,
            message: "Invalid phone number",
          },
        })}
        type="text"
        placeholder="Phone Number (e.g., 0312 3456789)"
        className="border rounded-lg p-2 mb-3"
      />
      {errors.phone && (
        <span className="text-red-500">{errors.phone.message}</span>
      )}
      <input
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        type="password"
        placeholder="Password"
        className="border rounded-lg p-2 mb-3"
      />
      {errors.password && (
        <span className="text-red-500">{errors.password.message}</span>
      )}
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-lg"
      >
        Login
      </button>
      <Link href={"/"} className="mt-4 text-blue-500 text-sm underline">
        Back to Welcome
      </Link>
    </form>
  );
};

export default Login;
