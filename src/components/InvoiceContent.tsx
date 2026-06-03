import { Timestamp } from 'firebase/firestore';
import type { BookingData } from '../firebase/services/BookingService';
import FeedbackQR from '../assets/FeedbackQR.png';

interface InvoiceContentProps {
  isPdf?: boolean;
  selectedBooking: BookingData;
}

const formatDate = (date: Timestamp | Date) => {
  if (!date) return "-";

  const d = date instanceof Timestamp ? date.toDate() : date;

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const InvoiceContent: React.FC<InvoiceContentProps> = ({ selectedBooking }) => {
  const checkInDate = selectedBooking.checkInAt?.toDate();
  const checkOutDate = selectedBooking.checkOutAt?.toDate();

  const totalDays = (checkInDate && checkOutDate)
    ? Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))) : 1;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">RC Stays & Resorts</h1>
          <p className="text-[#6B7280] text-sm max-w-xs">
            Fatehabad Road, Near Taj Mahal, Agra 282001, +91 7017656483
          </p>
        </div>

        <div className="text-right">
          <h2 className="uppercase text-lg text-[#6B7280] font-medium">Invoice</h2>
          <p className="text-sm font-bold">{selectedBooking?.bookingId || "-"}</p>
          <p className="text-[#6B7280] text-sm">{formatDate(new Date())}</p>
        </div>
      </div>

      <hr className="text-[#E5E7EB]" />

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="uppercase text-sm text-[#6B7280] font-medium">Billed To</h2>
          <div>
            <h3 className="font-semibold">{selectedBooking?.guestName}</h3>
            <p className="text-sm">{selectedBooking?.phone}</p>
            {selectedBooking?.aadharNumber && (
            <p className="text-sm">Aadhar No: {selectedBooking?.aadharNumber}</p>)}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="uppercase text-sm text-[#6B7280] font-medium">Stay</h2>
          <div>
            <h3 className="font-semibold">Room #{selectedBooking?.roomNumber}</h3>
            <p className="text-sm">
              {formatDate(selectedBooking?.checkInAt)} →{" "} {formatDate(selectedBooking?.checkOutAt)}
            </p>
            <p className="text-sm">{totalDays} days</p>
            <p className="text-sm">Guests: {selectedBooking?.numberOfGuests}</p>
          </div>
        </div>
      </div>

      <div className="border border-[#E5E7EB] rounded-xl p-2 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F9FAFB] text-xs text-[#6B7280] uppercase">
              <th className="text-left p-3">Description</th>
              <th className="p-3">Days</th>
              <th className="p-3">Per day price</th>
              <th className="text-right p-3">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm">
              <td className="text-left p-3">Room Charges (Room #{selectedBooking?.roomNumber})</td>
              <td className="text-center p-3">{totalDays}</td>
              <td className="text-center p-3">₹{Math.floor(selectedBooking?.totalAmount / totalDays).toLocaleString("en-IN")}</td>
              <td className="text-right p-3">₹{selectedBooking?.totalAmount?.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="w-1/2 ml-auto">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{selectedBooking?.totalAmount?.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm text-[#6B7280]">
          <span>Paid</span>
          <span>₹{selectedBooking?.paidAmount?.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm text-[#6B7280]">
          <span>Balance</span>
          <span>₹{selectedBooking?.pendingAmount?.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="text-sm text-[#6B7280]">
        <strong>Payment Method:</strong>{" "}{selectedBooking?.paymentMethod || "-"}
      </div>

      <hr className="border-0 border-t border-dashed border-[#E5E7EB]" />

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-semibold">We value your feedback!</h3>
          <p className="text-[#6B7280] text-sm">Scan the QR code to rate your stay and share your experience.</p>
        </div>

        <img src={FeedbackQR} className="w-32 h-32 border border-[#E5E7EB] rounded-xl" />
      </div>
    </div>
  )
}

export default InvoiceContent