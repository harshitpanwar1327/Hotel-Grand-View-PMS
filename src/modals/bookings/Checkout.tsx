import { X } from "lucide-react"
import { checkOut, type BookingData } from "../../firebase/services/BookingService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

interface CheckoutProps {
  setOpenModal: (open: boolean) => void;
  selectedBooking: BookingData;
  fetchBookings: () => void;
}

interface CheckoutData {
  collectedAmount: number;
  paymentMethod: string;
}

const Checkout: React.FC<CheckoutProps> = ({ setOpenModal, selectedBooking, fetchBookings }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutData>({
    defaultValues: {
      collectedAmount: selectedBooking.pendingAmount || 0,
      paymentMethod: "Cash"
    }
  });

  const onsubmit = async (data: CheckoutData) => {
    try {
      setLoading(true);
      await checkOut(selectedBooking.bookingId, selectedBooking.roomId, selectedBooking.paidAmount, selectedBooking.pendingAmount, data.collectedAmount, data.paymentMethod);
      toast.success("Booking updated successfully.");
      fetchBookings();
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
          <h2 className="text-lg font-semibold">Checkout · {selectedBooking.guestName}</h2>
          <X size={18} className="cursor-pointer text-gray-500 hover:text-black hover:scale-105 transition duration-300" onClick={()=>setOpenModal(false)}/>
        </div>

        <div className="flex flex-col gap-2 bg-blue-50 rounded-xl text-sm p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-gray-500 font-medium">Room</p>
            <p className="font-medium">#{selectedBooking.roomNumber}</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-gray-500 font-medium">Stay</p>
            <p className="font-medium">{selectedBooking.checkInAt.toDate().toLocaleDateString()} → {selectedBooking.checkOutAt.toDate().toLocaleDateString()}</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-gray-500 font-medium">Total</p>
            <p className="font-medium">₹{selectedBooking.totalAmount?.toLocaleString('en-IN')}</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-gray-500 font-medium">Paid</p>
            <p className="font-medium">₹{selectedBooking.paidAmount?.toLocaleString('en-IN')}</p>
          </div>

          <hr className="text-gray-200" />

          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold">Pending</p>
            <p className="font-semibold text-red-500">₹{selectedBooking.pendingAmount?.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="collectedAmount" className="text-xs">Collect now (₹) <span className="text-red-500">*</span></label>
            <input type="number" id="collectedAmount" min={0} max={selectedBooking.pendingAmount || 0} className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter amount to collect"
              {...register("collectedAmount", {
                required: "Amount is required",
                valueAsNumber: true
              })}
            />
            {errors.collectedAmount && <p className="text-red-500 text-xs">{errors.collectedAmount.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="paymentMethod" className="text-xs">Payment Method <span className="text-red-500">*</span></label>
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
        </div>

        <div className='flex justify-end gap-3 text-sm'>
          <button type="button" className='border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 hover:shadow-lg transition duration-300' onClick={()=>setOpenModal(false)}>Cancel</button>
          <button type="submit" className='bg-[#1B2A41] shadow-[#1B2A41]/40 hover:shadow-lg text-white px-4 py-2 rounded-xl hover:opacity-90 transition duration-300'>{loading ? <ClipLoader size={18} color="#ffffff" /> : "Confirm Checkout"}</button>
        </div>
      </form>
    </div>
  )
}

export default Checkout