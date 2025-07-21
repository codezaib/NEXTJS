import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { setUser } from "@/features/User";
import Link from "next/link";
import axios from "axios";
const Signup = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: async (data) => {
      console.log("hello occured");
      const { data: response } = await axios.post(
        "http://localhost:4000/api/v1/auth/register",
        {
          ...data,
        },
        { withCredentials: true }
      );
      if (!response) toast.error("Please try again.");
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        toast.success("Registration successful!");
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
    if (!data.phone.includes(" ")) {
      data.phone = data.phone.slice(0, 4) + " " + data.phone.slice(4);
    }
    mutate(data);
  };
  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="flex flex-col h-full justify-center"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
      <input
        {...register("name", {
          required: "Name is required",
        })}
        type="text"
        placeholder="Name"
        className="border rounded-lg p-2 mb-3"
      />
      <input
        {...register("email", {
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Invalid email address",
          },
        })}
        type="email"
        placeholder="Email"
        className="border rounded-lg p-2 mb-3"
      />
      <input
        {...register("phone", {
          required: "Phone Number is required",
          pattern: {
            value: /^03\d{2}\s\d{7}$/,
            message: "Invalid phone number",
          },
        })}
        type="text"
        placeholder="phone No. eg 0309 9238934"
        className="border rounded-lg p-2 mb-3"
      />
      <input
        {...register("password", {
          required: "password is required",
          minLength: { value: 6, message: "password must be of 6 characters" },
        })}
        type="password"
        placeholder="Password"
        className="border rounded-lg p-2 mb-3"
      />
      <button
        type="submit"
        disabled={isSuccess || isError}
        className="w-full py-2 bg-green-500 text-white rounded-lg"
      >
        Sign Up
      </button>
      <Link href={"/"} className="mt-4 text-blue-500 text-sm underline">
        Back to Welcome
      </Link>
    </form>
  );
};

export default Signup;
