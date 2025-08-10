"use client";

import "../styles/global.css";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// функция сохранения токена: пытаемся сохранить через electron bridge, иначе в localStorage
const saveAuthToken = async (token: string) => {
  // @ts-ignore
  if (typeof window !== "undefined" && window.auth?.saveToken) {
    // 👇 Сохраняем токен через keytar в electron
    await window.auth.saveToken(token);
  } else {
    // локальное сохранение для браузера
    localStorage.setItem("auth-token", token);
  }
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // TODO: отправка на сервер
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Registration failed");
        return;
      }

      // Если сервер возвращает токен, сохраняем его
      if (json.token) {
        await saveAuthToken(json.token);
        alert("Registration successful");
        router.push("/profile");
      } else {
        // Иначе отправляем на страницу логина
        alert("Registration successful. Please login.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      alert(
        "Unexpected error during registration: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
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
          <Link href="/login" className="text-blue-400 flex justify-center hover:underline">
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}
