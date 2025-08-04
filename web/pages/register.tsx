
import '../styles/globals.css'
// web/pages/register.tsx
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
    const router = useRouter();

  const onSubmit = (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Registering:", data);
    // отправка на сервер
    router.push("/login");
  };

  return (
  <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create a new account
      </h2>
    </div>
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                {...register('username', { required: 'Username is required' })}
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2"
              />
              {errors.username && (<p className="text-red-500 text-sm mt-1">{errors.username.message}</p>)}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2"
              />
              {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2"
              />
              {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>)}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === watch('password') || 'Passwords do not match'
                })}
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2"
              />
              {errors.confirmPassword && (<p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>)}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

}
