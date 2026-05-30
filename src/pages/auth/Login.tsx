import { useState } from "react"
import { useForm } from "react-hook-form"
import { ClipLoader } from "react-spinners"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { FirebaseError } from "firebase/app"
import { Hotel } from "lucide-react"
import { loginUser } from "../../firebase/services/AuthService"

interface LoginInputs {
  email: string,
  password: string
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const onSubmit = async (data: LoginInputs) => {
    try {
      setLoading(true);
      const user = await loginUser(data.email, data.password);
      if (!user.isActive) {
        toast.error("Your account is currently inactive. Please contact the administrator to activate your account.");
        return;
      }
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("userId", user.uid);
      sessionStorage.setItem("userEmail", user.email || "");
      sessionStorage.setItem("userRole", user.role);
      toast.success("Logged in successfully");
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      const err = error as FirebaseError;
      if (err.code === "auth/invalid-credential") {
        toast.error("Invalid email or password!");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-[#fbfcfe] p-4'>
      <form className="w-full md:w-2/3 lg:w-1/3 flex flex-col gap-6 border border-gray-200 rounded-xl shadow-lg p-8 md:p-10" onSubmit={handleSubmit(onSubmit)}>
        <div className='flex items-center gap-3'>
          <div className="w-10 h-10 rounded-xl bg-[#0f2942] text-white flex items-center justify-center">
            <Hotel size={20} />
          </div>
          <div>
            <h2 className='font-semibold'>Hotel Grand View</h2>
            <p className='text-xs text-gray-500 font-medium'>Reception Console</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Sign in</h2>
          <p className="text-sm text-gray-500 font-medium">Use your staff credentials to continue.</p>
        </div>

        <div className='flex flex-col gap-4'>
          <div className="flex flex-col gap-1">
            <label htmlFor='email' className='text-xs font-medium'>Email</label>
            <input type='email' id='email' placeholder='Enter email' className='p-2 border border-gray-300 rounded-xl focus:outline-none focus-within:border-black focus-within:ring-1 focus-within:ring-black transition duration-300'
              {...register("email", {
                required: "Email is required", 
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                  message: "Enter a valid email address"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor='password' className='text-xs font-medium'>Password</label>
            <input type='password' id='password' placeholder="••••••••" className='p-2 border border-gray-300 rounded-xl focus:outline-none focus-within:border-black focus-within:ring-1 focus-within:ring-black transition duration-300' 
              {...register("password", {
                required: "Password is required"
              })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button className='w-full p-3 rounded-xl bg-black/90 hover:opacity-90 text-sm text-white font-semibold transition duration-300'>{loading ? <ClipLoader size={18} color="#ffffff" /> : 'Sign In'}</button>
        </div>
      </form>
    </div>
  )
}

export default Login