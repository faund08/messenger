"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

type LoginForm = {
  username: string;
  password: string;
};

type JwtPayload = {
  exp?: number;
  [key: string]: any;
};

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth-token") || getCookie("token");
    if (!token) {
      setChecking(false);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp > now) {
        const userId = localStorage.getItem("user-id");
        if (userId) {
          // Если токен валиден и есть id, редиректим
          router.replace(`/profile/${userId}`);
          return; // не нужно setChecking(false), редирект уводит со страницы
        } else {
          // Если id нет, сбрасываем токен и показываем форму логина
          clearAuth();
          setChecking(false);
        }
      } else {
        clearAuth();
        setChecking(false);
      }
    } catch {
      clearAuth();
      setChecking(false);
    }
  }, [router]);

  function clearAuth() {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-id");
    deleteCookie("token");
  }

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  function deleteCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = name + "=; Max-Age=0; path=/";
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Checking authentication...
      </div>
    );
  }

  return <LoginForm router={router} clearAuth={clearAuth} />;
}

function LoginForm({
  router,
  clearAuth,
}: {
  router: ReturnType<typeof useRouter>;
  clearAuth: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Login failed");
        setLoading(false);
        return;
      }

      const token = json.token || json.accessToken;
      const user = json.user;
      if (!token || !user) {
        alert("No token or user info received");
        setLoading(false);
        return;
      }

      // Сохраняем токен и id пользователя
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      localStorage.setItem("auth-token", token);
      localStorage.setItem("user-id", user.id);
      localStorage.setItem("user-username", user.username);

      alert("Login successful");
      router.push(`/profile/${user.id}`);
    } catch (error: any) {
      alert("Unexpected error: " + (error.message || error));
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-radial from-white from-7% via-indigo-500 via-30% to-zinc-900 flex flex-col items-center justify-center p-4">
      <div className="w-75 h-75 md:w-100 md:h-100 lg:w-150 lg:h-150 rounded-[15px] rounded-tr-[100px] rounded-bl-[100px] flex flex-col items-center justify-center bg-zinc-900">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          <h1 className="text-5xl font-bold mb-20 flex justify-center">
            Login
          </h1>
          <input
            {...register("username", { required: "Username is required" })}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.username && (
            <p className="text-red-500 text-sm -mt-2">
              {errors.username.message}
            </p>
          )}
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm -mt-2">
              {errors.password.message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-950 text-white py-2 rounded active:bg-blue-900"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link
            href="/register"
            className="text-blue-400 flex justify-center hover:underline"
          >
            Registration
          </Link>
        </form>
      </div>
    </div>
  );
}
