import { useCallback, useEffect, useState } from "react";
import Checkout from "../../modals/bookings/Checkout";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { getBookings, type BookingData } from "../../firebase/services/BookingService";
import { formatLocalDate } from "../../utils/Helper";
import { LogOut } from "lucide-react";
import { Timestamp } from "firebase/firestore";

const statusFilter = ["All", "Active", "Checked Out"];

const Bookings = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);

  const [status, setStatus] = useState<string>("All");
  const [date, setDate] = useState<string>(formatLocalDate(new Date()));

  const [loading, setLoading] = useState<boolean>(false);

  const [openCheckoutModal, setOpenCheckoutModal] = useState<boolean>(false);

  const [selectedBooking, setSelectedBooking] = useState<BookingData>({
    aadharNumber: "",
    bookingId: undefined,
    bookingStatus: "",
    checkInAt: Timestamp.now(), 
    checkOutAt: Timestamp.now(), 
    createdBy: "",
    guestName: "",
    numberOfGuests: 0,
    paidAmount: 0,
    paymentMethod: "",
    paymentStatus: "",
    pendingAmount: 0,
    phone: "",
    roomId: "",
    roomNumber: "",
    totalAmount: 0,
  });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBookings({ status, date });
      setBookings(response as BookingData[]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch bookings!");
    } finally {
      setLoading(false);
    }
  }, [status, date]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const handleCheckout = (booking: BookingData) => {
    setSelectedBooking(booking);
    setOpenCheckoutModal(true);
  }

  return (
    <div className="mt-10 lg:mt-0 flex-1 flex flex-col gap-6 p-6 overflow-auto">
      <h1 className="text-3xl font-bold">Bookings</h1>

      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="statusFilter" className="text-xs font-semibold">Status:</label>
          <select name="statusFilter" id="statusFilter" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" value={status} onChange={(e)=>setStatus(e.target.value)}>
            {statusFilter.map((status, index) => (
              <option key={index} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="dateFilter" className="text-xs font-semibold">Date:</label>
          <input type="date" name="dateFilter" id="dateFilter" className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300" value={date} onChange={(e)=>setDate(e.target.value)} />
        </div>

        <button type="button" className='self-end border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-100 hover:border-gray-500 transition duration-300'
          onClick={() => {
            setStatus("All");
            setDate(formatLocalDate(new Date()));
          }}
        >Reset</button>
      </div>

      {loading ? (
        <div className="flex grow items-center justify-center">
          <ClipLoader color="#1B2A41" size={50} />
        </div>
      ) : (
        <div className="grow rounded-2xl border border-gray-200 shadow-sm overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr className="text-left text-gray-500 text-sm">
                <th className="px-6 py-3 font-semibold">Guest</th>
                <th className="px-6 py-3 font-semibold">Room</th>
                <th className="px-6 py-3 font-semibold">Check-in</th>
                <th className="px-6 py-3 font-semibold">Check-out</th>
                <th className="px-6 py-3 font-semibold">Total</th>
                <th className="px-6 py-3 font-semibold">Paid</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                {/* <th className="px-6 py-3"></th> */}
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition text-sm">
                  <td className="px-6 py-3">
                    <h2 className="font-semibold">{booking.guestName}</h2>
                    <p className="text-gray-500">{booking.phone}</p>
                  </td>
                  <td className="px-6 py-3 font-semibold">#{booking.roomNumber}</td>
                  <td className="px-6 py-3">{booking.checkInAt?.toDate().toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-3">{booking.checkOutAt?.toDate().toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-3 font-semibold">₹{booking.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3">
                    <h2 className="font-semibold">₹{booking.paidAmount?.toLocaleString('en-IN')}</h2>
                    <p className="text-xs">due ₹{booking.pendingAmount?.toLocaleString('en-IN')}</p>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`flex items-center justify-center px-3 py-1 rounded-full font-medium ${booking.bookingStatus==='Active' ? 'bg-green-600/10 text-green-600' : 'bg-red-600/10 text-red-600'}`}>{booking.bookingStatus || '-'}</span>
                      <span className={`flex items-center justify-center px-3 py-1 rounded-full font-medium ${booking.paymentStatus==='Paid' ? 'bg-green-600/10 text-green-600' : 'bg-[#f7ebc8] text-[#5b4720]'}`}>{booking.paymentStatus || '-'}</span>
                    </div>
                  </td>
                  {/* <td className="px-4 py-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 shadow-sm font-semibold bg-white hover:scale-102 transition duration-300">
                      <FileText className="w-4 h-4 text-gray-500" /> Invoice
                    </button>
                  </td> */}
                  <td className="px-4 py-3">
                    {(booking.bookingStatus!=='Checked Out' || booking.paymentStatus==='Partial') &&
                      <button className="flex items-center gap-2 bg-[#1B2A41] shadow-[#1B2A41]/40 hover:shadow-lg text-white px-4 py-2 rounded-xl hover:opacity-90 transition duration-300" onClick={()=>handleCheckout(booking)}>
                        <LogOut className="w-4 h-4 text-white" /> Checkout
                      </button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openCheckoutModal && <Checkout setOpenModal={setOpenCheckoutModal} selectedBooking={selectedBooking} fetchBookings={fetchBookings} />}
    </div>
  )
}

export default Bookings