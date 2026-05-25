import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react"
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { addRoom, type RoomData } from "../firebase/services/RoomService";

interface AddRoomProps {
  setOpenModal: (open: boolean) => void;
}

const AddRoom: React.FC<AddRoomProps> = ({ setOpenModal }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoomData>({});

  const onsubmit = async (data: RoomData) => {
    try {
      setLoading(true);
      await addRoom(data);
      toast.success("Room added successfully!");
      reset();
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
      <form onSubmit={handleSubmit(onsubmit)} onClick={(e)=>e.stopPropagation()} className="bg-white w-full md:w-2/3 lg:w-1/2 rounded-xl flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Add New Room</h2>
          <X size={18} className="cursor-pointer text-gray-500 hover:text-black hover:scale-105 transition duration-300" onClick={()=>setOpenModal(false)}/>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="roomNumber" className="text-xs">Room No.<span className="text-red-500">*</span></label>
            <input type="text" id="roomNumber" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter room number"
              {...register("roomNumber", { 
                required: "Room number is required"
              })} 
            />
            {errors.roomNumber && <p className="text-red-500 text-xs">{errors.roomNumber.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="roomType" className="text-xs">Type <span className="text-red-500">*</span></label>
            <select id="roomType" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" 
              {...register("roomType", { 
                required: "Room type is required"
              })}
            >
              <option value='standard'>Standard</option>
              <option value='deluxe'>Deluxe</option>
              <option value='suite'>Suite</option>
              <option value='family'>Family</option>
            </select>
            {errors.roomType && <p className="text-red-500 text-xs">{errors.roomType.message}</p>}
          </div>
        
          <div className="flex flex-col gap-1">
            <label htmlFor="pricePerNight" className="text-xs">Price <span className="text-red-500">*</span></label>
            <input id="pricePerNight" type="number" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter room price"
              {...register("pricePerNight", {
                required: "Price is required",
                valueAsNumber: true
              })}
            />
            {errors.pricePerNight && <p className="text-red-500 text-xs">{errors.pricePerNight.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="status" className="text-xs">Status <span className="text-red-500">*</span></label>
            <select id="status" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" 
              {...register("status", {
                required: "Status is required"
              })}
            >
              <option value='available'>Available</option>
              <option value='occupied'>Occupied</option>
              <option value='maintenance'>Maintenance</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
          </div>
        </div>

        <div className='flex justify-end gap-3 text-sm'>
          <button className='border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 hover:shadow-lg transition duration-300' onClick={()=>setOpenModal(false)}>Cancel</button>
          <button className='bg-[#1B2A41] shadow-[#1B2A41]/40 hover:shadow-lg text-white px-4 py-2 rounded-xl hover:opacity-90 transition duration-300'>{loading ? <ClipLoader size={18} color="#ffffff" /> : "Add Room"}</button>
        </div>
      </form>
    </div>
  )
}

export default AddRoom