import { useState } from "react"
import { useForm } from "react-hook-form"
import { BedDouble, ShieldCheck, Sparkles } from "lucide-react"
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
    <div className='w-screen h-screen flex bg-[#fbfcfe]'>
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-[#04122a] via-[#1c2c4b] to-[#383c44] text-white p-14 flex-col justify-between">
        <div className="flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="w-14 h-14 rounded-2xl border border-white/10 p-2"/>
            <div>
              <h2 className="text-xl font-semibold">RC Stays & Resorts</h2>
              <p className="text-sm text-gray-300">Hotel Management System</p>
            </div>
          </div>
          <div className="flex items-center w-fit gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm">
            <Sparkles size={14} className="text-yellow-400" />
            <span>Hospitality, Reimagined</span>
          </div>
          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-tight max-w-120">One console for every property in your group.</h1>
            <p className="text-gray-300 text-lg max-w-125">Reception, rooms, bookings and invoicing — unified across all RC Stays properties with role-based access for staff and management.</p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-white/10">
              <BedDouble size={18} className="text-[#ddb240]"/>
              <p>Live room status</p>
            </div>
            <div className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-white/10">
              <ShieldCheck size={18} className="text-[#ddb240]"/>
              <p>Secure staff access</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">© 2026 RC Stays & Resorts. All rights reserved.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <form className="w-full flex flex-col gap-10 max-w-120" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="text-2xl font-semibold">Sign in to continue</h2>
            <p className="text-md text-gray-500 font-medium">Welcome back. Use your staff credentials to access the console.</p>
          </div>

          <div className='flex flex-col gap-6'>
            <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
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
    </div>
  )
}

export default Login