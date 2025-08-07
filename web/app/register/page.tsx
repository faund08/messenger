'use client';

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type LoginForm = {
  username: string;
  password: string;
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
        alert(json.error  'Login failed');
        return;
      }

      const token = json.token  json.accessToken;

      if (!token) {
        alert('No token received');
        return;
      }

      // 👇 Проверяем наличие window.auth
      // @ts-ignore
      if (!window.auth || typeof window.auth.saveToken !== 'function') {
        console.error('window.auth is not available');
        alert('Auth bridge not initialized');
        return;
      }

      // 👇 Сохраняем токен через keytar
      // @ts-ignore
      await window.auth.saveToken(token);
      console.log('Token saved:', token);

      alert('Login successful');
      router.push('/profile');

    } catch (error) {
      console.error('Login error:', error);
      alert('Unexpected error: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("username", { required: "Username is required" })}
          placeholder="Username"
        />
        {errors.username && <p>{errors.username.message}</p>}

        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}