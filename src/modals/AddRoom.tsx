import { useForm } from "react-hook-form";
import { X } from "lucide-react"
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { toast } from "react-toastify";

interface Room {
  room: string;
  type: string;
  price: number;
  status: string;
}

interface AddRoomProps {
  setOpenModal: (open: boolean) => void;
}

const AddRoom: React.FC<AddRoomProps> = ({ setOpenModal }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Room>({});

    const onsubmit = (data: Room) => {
        try {
            setLoading(true);
            toast.success("Room added successfully!");
            reset();
            setLoading(false);
            setOpenModal(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to add room.");
            setLoading(false);
        }
    }

  return (
    <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center p-8 bg-black/80 z-70' onClick={()=>setOpenModal(false)}>
        <form onSubmit={handleSubmit(onsubmit)} onClick={(e)=>e.stopPropagation()} className="bg-white max-h-[90vh] overflow-y-auto w-full md:w-1/2 lg:w-1/3 rounded-xl flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between gap-10">
                <h2 className="text-lg font-semibold">Add New Room</h2>
                <X size={16} className="cursor-pointer text-gray-500 hover:text-black hover:scale-102 transition duration-300" onClick={()=>setOpenModal(false)}/>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#1B2A41] font-semibold">Room No.<span className="text-red-500">*</span></label>
                    <input type="text" id="room" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter room number"
                    {...register("room", { required: "Room number is required" })} />
                    {errors.room && <p className="text-red-500 text-xs">{errors.room.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#1B2A41] font-semibold">Type <span className="text-red-500">*</span></label>
                    <select className="w-full p-2 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" {...register("type", { required: "Room type is required" })}>
                        <option value='standard'>Standard</option>
                        <option value='deluxe'>Deluxe</option>
                        <option value='suite'>Suite</option>
                        <option value='family'>Family</option>
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#1B2A41] font-semibold">Price <span className="text-red-500">*</span></label>
                    <input type="number" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter room price"
                    {...register("price", { valueAsNumber: true })}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#1B2A41] font-semibold">Status <span className="text-red-500">*</span></label>
                    <select className="w-full p-2 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" {...register("status")}>
                        <option value='available'>Available</option>
                        <option value='occupied'>Occupied</option>
                        <option value='maintenance'>Maintenance</option>
                    </select>
                </div>
            </div>
            <div className='flex justify-end gap-3'>
                <button className='border border-gray-200 px-5 py-2 rounded-xl hover:bg-[#1B2A41]/80 hover:text-white hover:opacity-90' onClick={()=>setOpenModal(false)}>Cancel</button>
                <button className='bg-[#1B2A41] shadow-[#1B2A41]/40 hover:shadow-lg text-white px-4 py-2 rounded-xl hover:opacity-90 transition duration-300'>{loading ? <ClipLoader size={18} color="#ffffff" /> : "Add Room"}</button>
            </div>
        </form>
    </div>
  )
}

export default AddRoom