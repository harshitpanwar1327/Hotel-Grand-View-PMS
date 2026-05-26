import { Search, FileText, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import Checkout from "../../modals/Checkout";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { getBookings, type BookingData } from "../../firebase/services/BookingService";

const tabStatus = ["All", "Active", "Checked Out"];

const Bookings = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);

  const [activeTab, setActiveTab] = useState<string>("All");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [openCheckoutModal, setOpenCheckoutModal] = useState<boolean>(false);

  const [selectedBooking, setSelectedBooking] = useState<BookingData>({
    identityNumber: "",
    bookingId: undefined,
    bookingStatus: "",
    checkInDate: "",
    checkOutDate: "",
    createdBy: "",
    guestName: "",
    numberOfGuests: 0,
    paidAmount: 0,
    paymentMethod: "",
    paymentStatus: "",
    pendingAmount: 0,
    phone: "",
    roomId: "",
    totalAmount: 0,
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getBookings();
      setBookings(response as BookingData[]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch bookings!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, []);

  const filteredBookings = activeTab === "All" ? bookings : bookings.filter((booking) => booking.bookingStatus === activeTab);

  const handleCheckout = (booking: BookingData) => {
    setSelectedBooking(booking);
    setOpenCheckoutModal(true);
  }

  return (
    <div className="mt-10 lg:mt-0 flex-1 flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-6">
        <div className="text-3xl font-bold">Bookings</div>
        <div className="flex items-center gap-2 w- px-3 p-2 border border-gray-300 rounded-2xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300">
          <Search className="w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search guest, room..." className="bg-transparent outline-none text-md text-gray-700 w-full" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabStatus.map((status, index) => (
          <button key={index} onClick={()=>setActiveTab(status)} className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm border transition duration-300 ${activeTab === status ? "bg-[#1B2A41] text-white border-[#1B2A41]" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex grow items-center justify-center">
          <ClipLoader color="#1B2A41" size={50} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f8fafc] border-b border-gray-200">
              <tr className="text-left text-gray-500 text-sm">
                <th className="px-6 py-3 font-semibold">Guest</th>
                <th className="px-6 py-3 font-semibold">Room</th>
                <th className="px-6 py-3 font-semibold">Check-in</th>
                <th className="px-6 py-3 font-semibold">Check-out</th>
                <th className="px-6 py-3 font-semibold">Total</th>
                <th className="px-6 py-3 font-semibold">Paid</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3"></th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.identityNumber} className="border-b border-gray-200 hover:bg-gray-50 transition text-sm">
                  <td className="px-6 py-3">
                    <div>
                      <h2 className="font-semibold">{booking.guestName}</h2>
                      <p className="text-gray-500">{booking.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 font-semibold">{booking.roomId}</td>
                  <td className="px-6 py-3">{booking.checkInDate?.toDate().toLocaleDateString()}</td>
                  <td className="px-6 py-3">{booking.checkOutDate?.toDate().toLocaleDateString()}</td>
                  <td className="px-6 py-3 font-semibold">{booking.totalAmount?.toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <h2 className="font-semibold">{booking.paidAmount?.toLocaleString()}</h2>
                    <p className="text-[#5b4720]">due ₹{booking.pendingAmount?.toLocaleString()}</p>
                  </td>
                  <td className="py-3">
                    <span className="px-3 py-1 rounded-full bg-[#f7ebc8] text-[#5b4720] font-medium">Active · Partial</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 shadow-sm bg-white hover:bg-gray-50 transition font-semibold"><FileText className="w-4 h-4 text-gray-500" /><span>Invoice</span></button>
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#0f2747] text-white shadow-sm hover:opacity-90 transition font-semibold" onClick={()=>handleCheckout(booking)}><LogOut className="w-4 h-4 text-white" /><span>Checkout</span></button>
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