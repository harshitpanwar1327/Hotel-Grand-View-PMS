import { useState } from "react"
import { useForm } from "react-hook-form"
import { ClipLoader } from "react-spinners"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { loginUser } from "../../firebase/services/AuthService"
import Logo from '../../assets/Logo.png'

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
      const result = await loginUser(data.email, data.password);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      const user = result.data;
      if (!user) {
        toast.error("User data not found");
        return;
      }

      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("userId", user.uid);
      sessionStorage.setItem("userEmail", user.email || "");
      sessionStorage.setItem("userRole", user.role);

      toast.success("Logged in successfully");
      
      switch (user.role) {
        case "Owner":
          navigate("/dashboard");
          break;
        case "Receptionist":
          navigate("/check-in");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-[#fbfcfe] p-4'>
      <form className="w-full md:w-2/3 lg:w-1/3 flex flex-col gap-6 border border-gray-200 rounded-xl shadow-lg p-8 md:p-10" onSubmit={handleSubmit(onSubmit)}>
        <div className='flex items-center gap-3'>
          <img src={Logo} alt="Logo" className="w-10 h-10 border border-gray-200 rounded-xl" />
          <div>
            <h2 className='font-semibold'>RC Stays & Resorts</h2>
            <p className='text-xs text-gray-500 font-medium'>Reception Console</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Sign in</h2>
          <p className="text-sm text-gray-500 font-medium">Use your staff credentials to continue.</p>
        </div>

        <div className='flex flex-col gap-4'>
          <div className="flex flex-col gap-1">
            <label htmlFor='email' className='w-fit text-xs'>Email</label>
            <input type='email' id='email' placeholder='Enter email' className='p-2 border border-gray-300 rounded-xl focus:outline-none focus-within:border-black focus-within:ring-1 focus-within:ring-black transition duration-300'
              {...register("email", {
                required: "Email is required", 
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                  message: "Enter a valid email address"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor='password' className='w-fit text-xs'>Password</label>
            <input type='password' id='password' placeholder="••••••••" className='p-2 border border-gray-300 rounded-xl focus:outline-none focus-within:border-black focus-within:ring-1 focus-within:ring-black transition duration-300' 
              {...register("password", {
                required: "Password is required"
              })}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <button className='w-full p-3 rounded-xl bg-black/90 hover:opacity-90 text-sm text-white font-semibold transition duration-300'>{loading ? <ClipLoader size={18} color="#ffffff" /> : 'Sign In'}</button>
        </div>
      </form>
    </div>
  )
}

export default Login