"use client";

import "../styles/global.css";
import Link from 'next/link'

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();
  const router = useRouter();

  const onSubmit = (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Registering:", data);
    // TODO: отправка на сервер
    router.push("/login");
  };

  return (
    <div className=" min-h-screen bg-radial from-white from-7% via-indigo-500 via-30% to-zinc-900 flex flex-col items-center justify-center p-4">
      <div className="w-75 h-150 md:w-100 lg:w-150 rounded-[15px] rounded-tl-[100px] rounded-br-[100px] flex flex-col items-center justify-center bg-zinc-900 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
          <h1 className="text-5xl font-bold mb-8 text-center text-white">Register</h1>

          <input
            {...register("username", { required: "Username is required" })}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.username && (
            <p className="text-red-500 text-sm -mt-2">{errors.username.message}</p>
          )}

          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm -mt-2">{errors.email.message}</p>
          )}

          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm -mt-2">{errors.password.message}</p>
          )}

          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
            type="password"
            placeholder="Confirm password"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm -mt-2">{errors.confirmPassword.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-950 text-white py-2 rounded active:bg-blue-900"
          >
            Register
          </button>
          <Link href="/login" className="text-blue-400 flex justify-center hover:underline">Login</Link>
        </form>
      </div>
    </div>
  );
}
