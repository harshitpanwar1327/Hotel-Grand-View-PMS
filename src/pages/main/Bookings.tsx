import { lazy, useEffect, useState } from "react";
import Checkout from "../../modals/bookings/Checkout";
import Invoice from "../../modals/bookings/Invoice";
import { ClipLoader } from "react-spinners";
import { formatDateTime, formatLocalDate } from "../../utils/Helper";
import { LogOut, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/Store";
import { fetchBookings, type BookingData } from "../../redux/slice/BookingSlice";

const HotelSelector = lazy(()=>import("../../components/HotelSelector"));
const Menubar = lazy(()=>import('../../components/Menubar'));

const statusFilter = ["All", "Active", "Checked Out"];

const Bookings = () => {
  const [status, setStatus] = useState<string>("All");
  const [date, setDate] = useState<string>(formatLocalDate(new Date()));

  const [openCheckoutModal, setOpenCheckoutModal] = useState<boolean>(false);
  const [openInvoiceModal, setOpenInvoiceModal] = useState<boolean>(false);

  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const selectedHotel = useSelector((state: RootState) => state.selectedHotel.items.selectedHotel);
  const { items: bookings, loading } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    if (!selectedHotel?.hotelId) return;

    dispatch(
      fetchBookings({ status, date, hotelId: selectedHotel.hotelId })
    );
  }, [dispatch, status, date, selectedHotel?.hotelId]);

  const handleCheckout = (booking: BookingData) => {
    setSelectedBooking(booking);
    setOpenCheckoutModal(true);
  }

  const handleInvoice = (booking: BookingData) => {
    setSelectedBooking(booking);
    setOpenInvoiceModal(true);
  }

  return (
    <div className="w-full flex flex-col overflow-auto">
      <div className={`grow relative ${loading ? 'overflow-hidden' : 'overflow-auto'}`}>
        {loading && (
          <div className='absolute inset-0 flex justify-center items-center backdrop-blur-xs z-49'>
            <ClipLoader color="#5048E5" />
          </div>
        )}

        <HotelSelector />

        <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
          <Menubar heading="Bookings" subheading={selectedHotel.hotelName} />

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="statusFilter" className="text-xs font-semibold">Status:</label>
              <select name="statusFilter" id="statusFilter" className="w-full p-2 border border-gray-200 bg-white rounded-xl focus:outline-none focus-within:border-[#0d1e3b] focus-within:ring-1 focus-within:ring-[#0d1e3b] transition duration-300" value={status} onChange={(e)=>setStatus(e.target.value)}>
                {statusFilter.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="dateFilter" className="text-xs font-semibold">Date:</label>
              <input type="date" name="dateFilter" id="dateFilter" className="w-full p-2 border border-gray-200 bg-white rounded-xl focus:outline-none focus-within:border-[#0d1e3b] focus-within:ring-1 focus-within:ring-[#0d1e3b] transition duration-300" value={date} onChange={(e)=>setDate(e.target.value)} />
            </div>

            <button type="button" className='self-end border border-gray-200 bg-white px-4 py-2 rounded-xl hover:bg-gray-100 hover:border-[#0d1e3b] transition duration-300'
              onClick={() => {
                setStatus("All");
                setDate(formatLocalDate(new Date()));
              }}
            >Reset</button>
          </div>
          
          <div className="grow rounded-2xl border border-gray-200 bg-white shadow-sm overflow-auto">
            <table className="w-full">
              <thead className="bg-[#FCFCF9] border-b border-gray-200">
                <tr className="text-left text-gray-500 text-sm">
                  <th className="px-6 py-3 font-semibold">Guest</th>
                  <th className="px-6 py-3 font-semibold">Room</th>
                  <th className="px-6 py-3 font-semibold">Check-in</th>
                  <th className="px-6 py-3 font-semibold">Check-out</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Paid</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.bookingId} className="border-b border-gray-200 text-sm">
                      <td className="px-6 py-3">
                        <h2 className="font-semibold">{booking.guestName}</h2>
                        <p className="text-gray-500">{booking.phone}</p>
                      </td>
                      <td className="px-6 py-3 font-semibold">#{booking.roomNumber}</td>
                      <td className="px-6 py-3">
                        {formatDateTime(booking?.checkInAt)}
                      </td>
                      <td className="px-6 py-3">
                        {formatDateTime(booking?.checkOutAt)}
                      </td>
                      <td className="px-6 py-3 font-semibold">
                        ₹{booking.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-3">
                        <h2 className="font-semibold">₹{booking.paidAmount?.toLocaleString('en-IN')}</h2>
                        <p className="text-xs">due ₹{booking.pendingAmount?.toLocaleString('en-IN')}</p>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col gap-1 text-xs text-center">
                          <span className={`flex items-center justify-center px-3 py-1 rounded-full font-medium ${booking.bookingStatus==='Active' ? 'bg-green-600/10 text-green-600' : 'bg-red-600/10 text-red-600'}`}>{booking.bookingStatus || '-'}</span>
                          <span className={`flex items-center justify-center px-3 py-1 rounded-full font-medium ${booking.paymentStatus==='Paid' ? 'bg-green-600/10 text-green-600' : 'bg-[#f7ebc8] text-[#5b4720]'}`}>{booking.paymentStatus || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {(booking.bookingStatus==='Checked Out') ? (
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 shadow-sm font-semibold bg-white hover:scale-102 hover:bg-[#F1E9D2] transition duration-300" onClick={()=>handleInvoice(booking)}>
                            <FileText className="w-4 h-4 text-gray-500" /> Invoice
                          </button>
                        ) : (
                          <button className="flex items-center gap-2 bg-[#0d1e3b] shadow-[#0d1e3b]/40 hover:shadow-lg text-white px-4 py-2 rounded-xl hover:opacity-90 transition duration-300" onClick={()=>handleCheckout(booking)}>
                            <LogOut className="w-4 h-4 text-white" /> Checkout
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-16 text-center">No bookings</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {openCheckoutModal && selectedBooking && (
          <Checkout setOpenModal={setOpenCheckoutModal} selectedBooking={selectedBooking} />
        )}
        {openInvoiceModal && selectedBooking && (
          <Invoice setOpenModal={setOpenInvoiceModal} selectedBooking={selectedBooking} />
        )}
      </div>
    </div>
  )
}

export default Bookings