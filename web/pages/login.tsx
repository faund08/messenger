
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

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
         <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Вход</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
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
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Войти
        </button>
      </form>
    </div>
    );
}