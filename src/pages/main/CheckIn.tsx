import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { addBooking } from "../../firebase/services/BookingService";
import { getRooms, type RoomData } from "../../firebase/services/RoomService";

interface CheckInFormData {
  identityNumber: string;
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  numberOfGuests: number;
  paidAmount: number;
  paymentMethod: string;
  roomId: string;
  phone: string;
}

const CheckIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [rooms, setRooms] = useState<RoomData[]>([]);

  const filteredRooms = rooms.filter((room) => room.status === "Available");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CheckInFormData>({});

  const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await getRooms();
        setRooms(response as RoomData[]);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch rooms!");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchRooms();
    }, []);

  const onSubmit = async (data: CheckInFormData) => {
    try {
      setLoading(true);
      await addBooking(data);
      toast.success("Booking confirmed successfully.");
      reset();
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Please try again later...");
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 lg:mt-0 flex-1 flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">New Check-In</h1>
        <p className="text-gray-500 text-sm">Fill guest details and confirm booking.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-6 p-6 bg-white rounded-2xl border border-gray-200 overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="guestName" className="text-xs font-semibold">Guest Name <span className="text-red-500">*</span></label>
            <input type="text" id="guestName" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter guest name"
              {...register("guestName", { 
                required: "Guest name is required"
              })} 
            />
            {errors.guestName && <p className="text-red-500 text-xs">{errors.guestName.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-xs font-semibold">Phone Number <span className="text-red-500">*</span></label>
            <input type="tel" id="phone" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter phone number"
              {...register("phone", {
                required: "Phone number is required",
                validate: (value) => {
                  const cleaned = value.replace(/[\s()-]/g, "");
                  const phoneRegex = /^(\+?\d{7,15})$/;
                  return (
                    phoneRegex.test(cleaned) ||
                    "Enter a valid phone number"
                  );
                },
              })}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="identityNumber" className="text-xs font-semibold">Aadhar Number / Passport Number <span className="text-red-500">*</span>
            </label>
            <input type="text" id="identityNumber" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter Aadhar or Passport number"
              {...register("identityNumber", {
                required: "Aadhar or Passport number is required",
                validate: (value) => {
                  const trimmed = value.trim();
                  const aadharRegex = /^\d{12}$/;
                  const passportRegex = /^[A-Z][0-9]{7}$/i;
                  if (aadharRegex.test(trimmed) || passportRegex.test(trimmed)) {
                    return true;
                  }
                  return "Enter a valid 12-digit Aadhar number or valid Passport number";
                },
              })}
            />
            {errors.identityNumber && (<p className="text-red-500 text-xs">{errors.identityNumber.message}</p>)}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="numberOfGuests" className="text-xs font-semibold">Total Guests <span className="text-red-500">*</span></label>
            <input type="number" id="numberOfGuests" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter total guests"
              {...register("numberOfGuests", { 
                required: "Total guests is required",
                min: { 
                  value: 1, 
                  message: "Total guests must be at least 1" 
                }
              })} 
            />
            {errors.numberOfGuests && <p className="text-red-500 text-xs">{errors.numberOfGuests.message}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="roomId" className="text-xs font-semibold">Room Type <span className="text-red-500">*</span></label>
            <select id="roomId" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300"
              {...register("roomId", {
                required: "Room is required"
              })} 
            >
              {filteredRooms.map((room)=>(
                <option key={room.roomId} value={room.roomId}>#{room.roomNumber} • {room.roomType}</option>
              ))}
            </select>
            {errors.roomId && <p className="text-red-500 text-xs">{errors.roomId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="checkInDate" className="text-xs font-semibold">Check-In Date <span className="text-red-500">*</span></label>
            <input type="date" id="checkInDate" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300"
              {...register("checkInDate", { 
                required: "Check-in date is required"
              })} 
            />
            {errors.checkInDate && <p className="text-red-500 text-xs">{errors.checkInDate.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="checkOutDate" className="text-xs font-semibold">Check-Out Date <span className="text-red-500">*</span></label>
            <input type="date" id="checkOutDate" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300"
              {...register("checkOutDate", { 
                required: "Check-out date is required"
              })} 
            />
            {errors.checkOutDate && <p className="text-red-500 text-xs">{errors.checkOutDate.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="paidAmount" className="text-xs font-semibold">Payment Amount (₹) <span className="text-red-500">*</span></label>
            <input type="number" id="paidAmount" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" min={0} placeholder="Advance payment"
              {...register("paidAmount", { 
                required: "Amount is required"
              })} 
            />
            {errors.paidAmount && <p className="text-red-500 text-xs">{errors.paidAmount.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="paymentMethod" className="text-xs font-semibold">Payment Method <span className="text-red-500">*</span></label>
            <select id="paymentMethod" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300"
              {...register("paymentMethod", { 
                required: "Payment method is required"
              })} 
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
            </select>
            {errors.paymentMethod && <p className="text-red-500 text-xs">{errors.paymentMethod.message}</p>}
          </div>

          <div className="bg-gray-200 rounded-xl p-4 flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Stay Total</p>
          </div>
        </div>

        <div className='flex justify-end gap-3 text-sm'>
          <button type="button" className='border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 hover:shadow-lg transition duration-300' onClick={()=>reset()}>Reset Form</button>
          <button type="submit" className='bg-[#1B2A41] shadow-[#1B2A41]/40 hover:shadow-lg text-white px-4 py-2 rounded-xl hover:opacity-90 transition duration-300'>{loading ? <ClipLoader size={18} color="#ffffff" /> : "Confirm Booking"}</button>
        </div>
      </form>
    </div>
  )
}

export default CheckIn