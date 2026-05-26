import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

interface CheckInFormData {
  name: string;
  phone?: string;
  adhaar: number;
  totalGuests?: number;
  roomType: "Standard" | "Deluxe" | "Suite" | "Family";
  checkInDate: string;
  checkOutDate: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}

const roomPrices: Record<"Standard" | "Deluxe" | "Suite" | "Family", number> = {
  Standard: 1000,
  Deluxe: 1500,
  Suite: 2000,
  Family: 2500,
};

const CheckIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CheckInFormData>({
    defaultValues: {
      roomType: "Standard",
    }
  });

  const checkInDate = useWatch({ control, name: "checkInDate" });
  const checkOutDate = useWatch({ control, name: "checkOutDate" });
  const roomType = useWatch({control, name: "roomType",});

  const calculateDays = () => {
    if (!checkInDate || !checkOutDate) return 0;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    const diffTime = end.getTime() - start.getTime();

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const totalDays = calculateDays();

  const roomPrice = roomPrices[roomType as keyof typeof roomPrices] || 0;
  const totalAmount = totalDays * roomPrice;

  const onSubmit = async () => {
    try {
      setLoading(true);
      toast.success("Booking confirmed successfully!");
      reset();
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Please try again later...");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
      <div className="gap-6">
        <h1 className="text-3xl font-bold">New Check-In</h1>
        <p className="text-gray-500 text-sm">Fill guest details and confirm booking.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onClick={(e)=>e.stopPropagation()} className="flex-1 min-h-0 flex flex-col gap-6 p-2 md:p-6 bg-white rounded-2xl border border-gray-200 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold">Guest Name <span className="text-red-500">*</span></label>
            <input type="text" id="name" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter guest name"
              {...register("name", { 
                required: "Guest name is required"
              })} 
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-semibold">Phone Number</label>
            <input type="tel" id="phone" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter phone number"
              {...register("phone")}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="adhaar" className="text-sm font-semibold">Adhaar Number <span className="text-red-500">*</span></label>
            <input type="number" id="adhaar" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter adhaar number"
              {...register("adhaar", { 
                required: "Adhaar number is required",
                minLength: { value: 12, message: "Adhaar number must be 12 digits" },
                maxLength: { value: 12, message: "Adhaar number must be 12 digits" }
              })} 
            />
            {errors.adhaar && <p className="text-red-500 text-xs">{errors.adhaar.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="totalGuests" className="text-sm font-semibold">Total Guests <span className="text-red-500">*</span></label>
            <input type="number" id="totalGuests" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter total guests"
              {...register("totalGuests", { 
                required: "Total guests is required",
                min: { value: 1, message: "Total guests must be at least 1" }
              })} 
            />
            {errors.totalGuests && <p className="text-red-500 text-xs">{errors.totalGuests.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="roomType" className="text-sm font-semibold">Room Type <span className="text-red-500">*</span></label>
            <select id="roomType" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300"
              {...register("roomType", { 
                required: "Room type is required"
              })} 
            >
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Family">Family</option>
            </select>
            {errors.roomType && <p className="text-red-500 text-xs">{errors.roomType.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="checkInDate" className="text-sm font-semibold">Check-In Date <span className="text-red-500">*</span></label>
            <input type="date" id="checkInDate" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300"
              {...register("checkInDate", { 
                required: "Check-in date is required"
              })} 
            />
            {errors.checkInDate && <p className="text-red-500 text-xs">{errors.checkInDate.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="checkOutDate" className="text-sm font-semibold">Check-Out Date <span className="text-red-500">*</span></label>
            <input type="date" id="checkOutDate" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300"
              {...register("checkOutDate", { 
                required: "Check-out date is required"
              })} 
            />
            {errors.checkOutDate && <p className="text-red-500 text-xs">{errors.checkOutDate.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="amount" className="text-sm font-semibold">Amount <span className="text-red-500">*</span></label>
            <input type="number" id="amount" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter amount"
              {...register("amount", { 
                required: "Amount is required",
                min: { value: 0, message: "Amount must be a positive number" }
              })} 
            />
            {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="paymentMethod" className="text-sm font-semibold">Payment Method <span className="text-red-500">*</span></label>
            <select id="paymentMethod" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300"
              {...register("paymentMethod", { 
                required: "Payment method is required"
              })} 
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">UPI</option>
            </select>
            {errors.paymentMethod && <p className="text-red-500 text-xs">{errors.paymentMethod.message}</p>}
          </div>
          <div className="bg-[#E5E7EB] rounded-xl p-4 text-[#1B2A41] flex flex-col gap-1">
            <p className="text-sm font-medium uppercase tracking-wide text-gray-600">Stay Total</p>
            <h1 className="text-lg font-semibold">₹{totalAmount.toLocaleString("en-IN")}</h1>
            <p className="text-sm text-gray-600">{totalDays} {totalDays === 1 ? "day" : "days"} • <span>₹{roomPrice.toLocaleString("en-IN")}/day</span></p>
          </div>
          <div className="flex flex-col gap-1 md:col-span-3">
            <label htmlFor="notes" className="text-sm font-semibold">Additional Notes</label>
            <textarea id="notes" rows={4} className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#374355] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter any additional notes"
              {...register("notes")} 
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="self-end px-6 py-2 bg-[#1B2A41] text-white rounded-xl hover:bg-[#374355] transition duration-300 disabled:bg-gray-400">
          {loading ? <ClipLoader size={18} color="#ffffff" /> : "Confirm Booking"}
        </button>
      </form>
    </div>
  )
}

export default CheckIn