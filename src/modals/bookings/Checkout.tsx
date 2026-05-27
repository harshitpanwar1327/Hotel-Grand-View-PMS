import { X } from "lucide-react"
import { type BookingData } from "../../firebase/services/BookingService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface CheckoutProps {
    setOpenModal: (open: boolean) => void;
    selectedBooking: BookingData;
    fetchBookings: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ setOpenModal, selectedBooking, fetchBookings }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm<BookingData>({
        defaultValues: selectedBooking
    });

    const onSubmit = async (data: BookingData) => {
        try {
          setLoading(true);
          await updateBooking(data.identityNumber, data);
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
        <form onClick={(e)=>e.stopPropagation()} className="bg-white w-full md:w-2/3 lg:w-1/2 rounded-xl flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Checkout · {selectedBooking.guestName}</h2>
                <X size={18} className="cursor-pointer text-gray-500 hover:text-black hover:scale-105 transition duration-300" onClick={() => setOpenModal(false)}/>
            </div>

            <div className="bg-[#f3f6fb] rounded-xl p-4">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500">Room</p>
                        <p className="font-medium text-gray-900">{selectedBooking.roomId}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500">Stay</p>
                        <p className="font-medium text-gray-900">{selectedBooking.checkInDate} → {selectedBooking.checkOutDate}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500">Total</p>
                        <p className="font-semibold text-gray-900">₹{selectedBooking.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500">Paid</p>
                        <p className="font-semibold text-gray-900">₹{selectedBooking.paidAmount?.toLocaleString()}</p>
                    </div>
                </div>

                <div className="border-t border-gray-300 mt-2 pt-2 flex items-center justify-between">
                    <h3 className=" font-semibold">Pending</h3>
                    <p className="font-semibold text-red-500">₹{selectedBooking.pendingAmount?.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="amount" className="text-xs font-semibold">Collect now (₹)</label>
                    <input type="number" id="amount" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" placeholder="Enter amount to collect"/>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="paymentMethod" className="text-xs font-semibold">Payment Method</label>
                    <select id="paymentMethod" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300">
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="UPI">UPI</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4">
                <button type="button" onClick={() => setOpenModal(false)} className="px-5 py-2 rounded-2xl border border-gray-300 bg-white font-semibold text-[#111827] hover:bg-gray-50 transition shadow-sm">
                    Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-2xl bg-[#0f2747] text-white font-semibold hover:opacity-90 transition shadow-sm">
                    Confirm Checkout
                </button>
            </div>
        </form>
    </div>
  )
}

export default Checkout