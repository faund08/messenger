"use client";

import '../styles/global.css';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";


type LoginForm = {
  username: string;
  password: string;
};

const saveAuthToken = async (token: string) => {
  if (typeof window !== 'undefined' && 'auth' in window && window.auth?.saveToken) {
    // @ts-ignore – electron
    await window.auth.saveToken(token);
  } else {
    // browser
    localStorage.setItem('auth-token', token);
  }
};

export default function LoginPage() {

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || 'Login failed');
        return;
      }

      const token = json.token || json.accessToken;
      console.log('Server response:', json);
      if (!token) {
        alert('No token received');
        return;
      }

      // Вместо window.auth.saveToken теперь:
      await saveAuthToken(token);

      alert('Login successful');
      router.push('/profile');
    } catch (error) {
      alert('Unexpected error');
    }
  };

  return (
    <div className="min-h-screen bg-radial from-white from-7% via-indigo-500 via-30% to-zinc-900 flex flex-col items-center justify-center p-4">
      <div className="w-75 h-75 md:w-100 md:h-100 lg:w-150 lg:h-150 rounded-[15] rounded-tr-[100px] rounded-bl-[100px] flex flex-col items-center justify-center bg-zinc-900">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
          <h1 className="text-5xl font-bold mb-20 flex justify-center">Login</h1>
          <input
            {...register("username", { required: "Username is required" })}
            type="username"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.username && <p className="text-red-500 text-sm -mt-2">{errors.username.message}</p>}
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm -mt-2">{errors.password.message}</p>}
          <button type="submit" className="w-full bg-blue-900 hover:bg-blue-950 text-white py-2 rounded active:bg-blue-900">
            Login
          </button>
          <Link href="/register" className="text-blue-400 flex justify-center hover:underline">Registration</Link>
        </form>
      </div>
    </div>
  );
}
