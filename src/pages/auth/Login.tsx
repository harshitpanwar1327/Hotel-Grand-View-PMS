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
    <>
      <div className="relative hidden lg:flex flex-col justify-center gap-16 w-1/2 p-16 bg-[linear-gradient(135deg,#111B2D,#1B2A41_60%,#263A63)] text-white">
        <div className="absolute -top-32 -right-32 size-120 rounded-full opacity-20 blur-3xl bg-[linear-gradient(135deg,#D1A85D,#E8D2A0)]" />
        <div className="absolute -bottom-40 -left-20 size-105 rounded-full opacity-10 blur-3xl bg-white" />

        <div className="flex items-center gap-3">
          <img src={Logo} alt="Logo" className="w-12 h-12 rounded-2xl"/>
          <div>
            <h2 className="text-xl font-semibold">RC Stays & Resorts</h2>
            <p className="text-sm text-white/80">Hotel Management System</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="w-fit flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/10 text-xs">
            <Sparkles size={14} className="text-[#D1A85D]" />
            <span>Hospitality, Reimagined</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight max-w-md">One console for every property in your group.</h1>
          <p className="text-white/80 text-lg max-w-lg">Reception, rooms, bookings and invoicing — unified across all RC Stays properties with role-based access for staff and management.</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 border border-white/10">
              <BedDouble size={16} className="text-[#ddb240]"/>
              <p>Live room status</p>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 border border-white/10">
              <ShieldCheck size={16} className="text-[#ddb240]"/>
              <p>Secure staff access</p>
            </div>
          </div>
        </div>

        <p className="text-white/80 text-sm">© 2026 RC Stays & Resorts. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <form className="w-full flex flex-col gap-8 max-w-lg" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold">Sign in to continue</h2>
            <p className="text-gray-500 font-medium text-sm">Welcome back. Use your staff credentials to access the console.</p>
          </div>

          <div className='flex flex-col gap-4'>
            <div className="flex flex-col gap-1">
              <label htmlFor='email' className='w-fit text-xs'>Email</label>
              <input type='email' id='email' placeholder='Enter email' className='p-2 border border-gray-300 rounded-xl focus:outline-none focus-within:border-[#0d1e3b] focus-within:ring-1 focus-within:ring-[#0d1e3b] transition duration-300'
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
              <input type='password' id='password' placeholder="••••••••" className='p-2 border border-gray-300 rounded-xl focus:outline-none focus-within:border-[#0d1e3b] focus-within:ring-1 focus-within:ring-[#0d1e3b] transition duration-300' 
                {...register("password", {
                  required: "Password is required"
                })}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <button className='w-full p-3 rounded-xl bg-[#0d1e3b] hover:opacity-90 text-sm text-white font-semibold transition duration-300'>{loading ? <ClipLoader size={18} color="#ffffff" /> : 'Sign In'}</button>
          </div>

          <p className="text-sm text-center text-gray-500">Protected console. Access is restricted to authorised RC Stays personnel.</p>
        </form>
      </div>
    </>
  )
}

export default Login