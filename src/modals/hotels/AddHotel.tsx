import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react"
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { addHotel } from "../../firebase/services/HotelService";
import { fetchHotels, type HotelData } from "../../redux/slice/HotelSlice";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/Store'

interface AddHotelProps {
  setOpenModal: (open: boolean) => void;
}

const AddHotel: React.FC<AddHotelProps> = ({ setOpenModal }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors } } = useForm<HotelData>({});

  const dispatch = useDispatch<AppDispatch>();

  const onsubmit = async (data: HotelData) => {
    try {
      setLoading(true);
      const response = await addHotel(data);
      if (response.success) {
        toast.success(response.message);
        dispatch(fetchHotels());
      } else {
        toast.error(response.message);
      }
      setLoading(false);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Please try again later...");
      setLoading(false);
    }
  }

  return (
    <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center p-8 bg-black/70 z-60' onClick={()=>setOpenModal(false)}>
      <form onSubmit={handleSubmit(onsubmit)} onClick={(e)=>e.stopPropagation()} className="bg-white w-full md:w-1/2 lg:w-1/3 rounded-xl flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Add New Hotel</h2>
          <X size={18} className="cursor-pointer text-gray-500 hover:text-black hover:scale-105 transition duration-300" onClick={()=>setOpenModal(false)}/>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="w-fit text-xs">Hotel Name<span className="text-red-500">*</span></label>
          <input type="text" id="name" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#0d1e3b] transition duration-300" placeholder="Enter hotel name"
            {...register("hotelName", { 
              required: "Hotel name is required"
            })} 
          />
          {errors.hotelName && <p className="text-red-500 text-xs">{errors.hotelName.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="w-fit text-xs">Address<span className="text-red-500">*</span></label>
          <input type="text" id="address" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#0d1e3b] transition duration-300" placeholder="Enter address"
            {...register("address", { 
              required: "Address is required"
            })} 
          />
          {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="w-fit text-xs">Phone<span className="text-red-500">*</span></label>
          <input type="text" id="phone" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#0d1e3b] transition duration-300" placeholder="Enter phone number"
            {...register("phone", { 
              required: "Phone number is required",
              pattern: {
                value: /^(\+91[- ]?)?[0-9]{10,12}$/,
                message: "Invalid phone number"
              }
            })} 
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
        </div>

        <div className='flex justify-end gap-3 text-sm'>
          <button type="button" className='border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 hover:shadow-lg transition duration-300' onClick={()=>setOpenModal(false)}>Cancel</button>
          <button type="submit" className='bg-[#0d1e3b] shadow-[#0d1e3b]/40 hover:shadow-lg text-white px-4 py-2 rounded-xl hover:opacity-90 transition duration-300 disabled:cursor-not-allowed!' disabled={loading}>{loading ? <ClipLoader size={18} color="#ffffff" /> : "Add Hotel"}</button>
        </div>
      </form>
    </div>
  )
}

export default AddHotel