"use client";


import '../styles/global.css';
import Image from 'next/image'

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type LoginForm = {
    email: string;
    password: string;
};



export default function LoginPage() {
    const {register, handleSubmit } = useForm<LoginForm>();
    const router = useRouter();

    const onSubmit = ( data: LoginForm ) => {
        console.log("Loggining with: ", data);
        //добавить логин
        router.push("/profile");
    };


    return (
         <div className="min-h-screen bg-linear-to-t from-sky-500 to-indigo-500 flex flex-col items-center justify-center p-4">
      <div 
      className="w-75 h-75
      md:w-100 md:h-100
      lg:w-150 lg:h-150
      rounded-[15]
      flex flex-col items-center justify-center bg-zinc-900">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
      <h1 className="text-5xl font-bold mb-20 flex justify-center">Login</h1>
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Пароль"
          className="w-full px-4 py-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded active:bg-blue-900">
          Войти
        </button>
      </form>
      </div>
    </div>
    );
}