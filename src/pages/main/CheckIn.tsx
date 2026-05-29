import { useForm, useWatch } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { addBooking } from "../../firebase/services/BookingService";
import { getRooms, type RoomData } from "../../firebase/services/RoomService";
import { Timestamp } from "firebase/firestore";
import { formatLocalDate } from "../../utils/Helper";

interface CheckInFormData {
  aadharNumber: string;
  checkInAt: Date;
  checkOutAt: Date;
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

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<CheckInFormData>({});

  const selectedRoomId = useWatch({
    control,
    name: "roomId",
  });

  const selectedCheckout = useWatch({
    control,
    name: "checkOutAt",
  });

  const fetchRooms = useCallback(async () => {
    try {
      const response = await getRooms('Available');
      setRooms(response as RoomData[]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch rooms!");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRooms();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchRooms]);

  useEffect(() => {
    if (rooms.length > 0) {
      const availableRoom = rooms.find((room) => room.status === "Available");
      if (availableRoom) setValue("roomId", availableRoom.roomId);
    }
  }, [rooms, setValue]);

  const now = new Date();
  const minCheckout = new Date();

  if (now.getHours() >= 11) {
    minCheckout.setDate(minCheckout.getDate() + 1);
  }

  const minCheckoutDate = formatLocalDate(minCheckout);

  const selectedRoom = rooms.find((room) => room.roomId === selectedRoomId);
  const pricePerDay = selectedRoom?.pricePerNight || 0;

  const checkInDate = new Date();
  const checkoutDate = selectedCheckout ? new Date(selectedCheckout) : null;

  let totalDays = 0;

  if (checkoutDate) {
    checkoutDate.setHours(11, 0, 0, 0);
    const diffTime = checkoutDate.getTime() - checkInDate.getTime();

    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (totalDays < 1) {
      totalDays = 1;
    }
  }

  const stayTotal = totalDays * pricePerDay;

  const onSubmit = async (data: CheckInFormData) => {
    try {
      setLoading(true);

      const checkInAt = new Date();
      const checkOutAt = new Date(data.checkOutAt);
      checkOutAt.setHours(11, 0, 0, 0);

      const bookingData = {
        ...data,
        roomNumber: selectedRoom?.roomNumber,
        checkInAt: Timestamp.fromDate(checkInAt),
        checkOutAt: Timestamp.fromDate(checkOutAt),
        totalAmount: stayTotal
      };

      await addBooking(bookingData);
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
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit phone number"
                }
              })}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="aadharNumber" className="text-xs font-semibold">Aadhar Number<span className="text-red-500">*</span>
            </label>
            <input type="text" id="aadharNumber" maxLength={14} className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter Aadhar number"
              {...register("aadharNumber", {
                required: "Aadhar number is required",
                validate: (value) => {
                  const cleaned = value.replace(/\s/g, "");
                  const aadharRegex = /^\d{12}$/;
                  if (aadharRegex.test(cleaned)) {
                    return true;
                  }
                  return "Enter a valid 12-digit Aadhar number";
                },
                onChange: (e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  value = value.substring(0, 12);
                  const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
                  setValue("aadharNumber", formatted, {
                    shouldValidate: true,
                  });
                },
              })}
            />
            {errors.aadharNumber && (<p className="text-red-500 text-xs">{errors.aadharNumber.message}</p>)}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="numberOfGuests" className="text-xs font-semibold">Total Guests <span className="text-red-500">*</span></label>
            <input type="number" id="numberOfGuests" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter total guests"
              {...register("numberOfGuests", {
                valueAsNumber: true,
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
              {rooms.map((room)=>(
                <option key={room.roomId} value={room.roomId}>#{room.roomNumber} • {room.roomType}</option>
              ))}
            </select>
            {errors.roomId && <p className="text-red-500 text-xs">{errors.roomId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Check-In Date & Time</label>
            <input type="text" disabled value={new Date().toLocaleString()} className="w-full p-2 bg-gray-100 border border-gray-200 rounded-xl" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="checkOutAt" className="text-xs font-semibold">Check-Out Date <span className="text-red-500">*</span></label>
            <input type="date" min={minCheckoutDate} id="checkOutAt" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300"
              {...register("checkOutAt", { 
                required: "Check-out date is required"
              })} 
            />
            {errors.checkOutAt && <p className="text-red-500 text-xs">{errors.checkOutAt.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="paidAmount" className="text-xs font-semibold">Payment Amount (₹) <span className="text-red-500">*</span></label>
            <input type="number" id="paidAmount" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" min={0} placeholder="Advance payment"
              {...register("paidAmount", {
                valueAsNumber: true,
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
            <h3 className="text-2xl font-semibold">₹ {stayTotal.toLocaleString('en-IN')}</h3>
            <p className="text-xs text-gray-500">{totalDays} {totalDays !== 1 ? 'days' : 'day'} • ₹{pricePerDay.toLocaleString('en-IN')}/day</p>
          </div>
        </div>

        <div className='flex justify-end gap-3 text-sm'>
          <button type="button" className='border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 hover:shadow-lg transition duration-300' onClick={()=>reset()}>Reset Form</button>
          <button type="submit" className='bg-[#1B2A41] shadow-[#1B2A41]/40 hover:shadow-lg text-white px-4 py-2 rounded-xl hover:opacity-90 transition duration-300 disabled:cursor-not-allowed!' disabled={loading}>{loading ? <ClipLoader size={18} color="#ffffff" /> : "Confirm Booking"}</button>
        </div>
      </form>
    </div>
  )
}

export default CheckIn