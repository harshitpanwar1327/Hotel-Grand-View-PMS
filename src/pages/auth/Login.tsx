import { useState } from "react"
import { useForm } from "react-hook-form"
import { ClipLoader } from "react-spinners"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase/Firebase"

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
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      sessionStorage.setItem('userId', userCredential.user.uid);
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem("userEmail", userCredential.user.email);
      navigate('/dashboard');
      toast.success("Logged in successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className='w-screen h-screen bg-[#f3f4f6] flex items-center justify-center'>
      <form className="max-w-2xl bg-white border border-gray-200 rounded-xl shadow-lg px-6 py-8 md:px-10 md:py-9" onSubmit={handleSubmit(onSubmit)}>
        <div className='flex items-center gap-4 mb-6'>
          <div className="w-10 h-10 rounded-2xl bg-[#0f2942] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1" />
            </svg>
          </div>
          <div>
            <h2 className='text-xl text-black font-bold'>Taj Heritage Stay</h2>
            <p className='text-sm text-gray-500'>Reception Console</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#111827]">Sign in</h2>
          <p className="text-sm text-gray-500">Use your staff credentials to continue.</p>
        </div>

        <div className='flex flex-col gap-4'>
          <div className="flex flex-col gap-1">
            <label htmlFor='email' className='text-sm font-semibold text-black'>Email</label>
            <input type='email' id='email' placeholder='Enter email' className='flex items-center gap-2 p-2 border border-gray-300 rounded-xl focus:outline-none focus-within:border-black focus-within:ring-1 focus-within:ring-black transition duration-300'
              {...register("email", {required: "Email is required", pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address",}})}/>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor='password' className='text-sm font-semibold text-black'>Password</label>
            <input type='password' id='password' placeholder="••••••••" className='flex items-center gap-2 p-2 border border-gray-300 rounded-xl focus:outline-none focus-within:border-black focus-within:ring-1 focus-within:ring-black transition duration-300' {...register("password", {required: "Password is required"})}/>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button className='w-full p-3 rounded-xl bg-black/90 hover:opacity-90 text-sm text-white font-semibold transition duration-300'>{loading ? <ClipLoader size={18} color="#0F1729" /> : 'Sign In'}</button>
        </div>
      </form>
    </div>

  )
}

export default Login