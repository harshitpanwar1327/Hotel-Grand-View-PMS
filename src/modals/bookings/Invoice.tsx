import { Printer, X } from "lucide-react"
import { type BookingData } from "../../firebase/services/BookingService";
import { useRef } from "react";
import { Timestamp } from "firebase/firestore";

interface InvoiceProps {
  setOpenModal: (open: boolean) => void;
  selectedBooking: BookingData;
}

const Invoice: React.FC<InvoiceProps> = ({ setOpenModal, selectedBooking }) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const formatDate = (date: Timestamp | Date) => {
        if (!date) return "-";

        const d = date instanceof Timestamp ? date.toDate() : date;

        return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        })
    }

    const calculateNights = () => {
        const checkIn =
            selectedBooking?.checkInAt instanceof Timestamp
                ? selectedBooking.checkInAt.toDate()
                : new Date(selectedBooking.checkInAt);

        const checkOut =
            selectedBooking?.checkOutAt instanceof Timestamp
                ? selectedBooking.checkOutAt.toDate()
                : new Date(selectedBooking.checkOutAt);

        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

  return (
    <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center p-8 bg-black/70 z-60 overflow-y-auto' onClick={()=>setOpenModal(false)}>
        <div onClick={(e)=>e.stopPropagation()} className="bg-[#ffffff] w-full md:w-2/3 lg:w-1/2 rounded-xl flex flex-col gap-4 p-4 overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <button className="flex items-center gap-2 bg-[#1B2A41] shadow-[#1B2A41]/40 hover:shadow-lg text-[#ffffff] px-4 py-2 rounded-xl hover:opacity-90 transition duration-300">
                    <Printer className="w-4 h-4 text-[#ffffff]" /> Print/Save PDF
                </button>
                <X size={18} className="cursor-pointer text-[#6B7280] hover:text-black hover:scale-105 transition duration-300" onClick={()=>setOpenModal(false)}/>
            </div>

            <div ref={invoiceRef} className="p-2 md:p-4 text-[#111827] bg-[#ffffff]">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Taj Heritage Stay</h1>
                        <div className="text-[#6B7280] text-sm">
                            <p>Fatehabad Road, Near Taj Mahal, Agra 282001</p>
                            <p>+91 93112 01990 • GSTIN 09ABCDE1234F1Z5</p>
                        </div>
                    </div>
                    <div className="text-left md:text-right md:mt-0 mt-4">
                        <p className="uppercase text-lg text-[#9CA3AF]">Invoice</p>
                        <h2 className="text-sm font-bold">{selectedBooking?.bookingId || "INV-1001"}</h2>
                        <p className="text-[#6B7280] text-sm">{formatDate(new Date())}</p>
                    </div>
                </div>

                <div className="border-b border-[#E5E7EB] my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="uppercase text-[#6B7280] text-sm font-semibold">Billed To</p>
                        <div className="mt-1">
                            <h3 className="text-md font-semibold">{selectedBooking?.guestName}</h3>
                            <p className="text-[#374151] text-sm">{selectedBooking?.phone}</p>
                            {selectedBooking?.aadharNumber && (
                            <p className="text-[#6B7280] text-sm">Aadhaar: {selectedBooking?.aadharNumber}</p>)}
                        </div>
                    </div>

                    <div>
                        <p className="uppercase text-[#6B7280] text-sm font-semibold">Stay</p>
                        <div className="mt-1">
                            <h3 className="text-md font-semibold">Room #{selectedBooking?.roomNumber}</h3>
                            <p className="text-sm">
                                {formatDate(selectedBooking?.checkInAt)} →{" "}
                                {formatDate(selectedBooking?.checkOutAt)}
                            </p>
                            <p className="text-[#4B5563] text-sm">{calculateNights()} nights</p>
                            <p className="text-[#4B5563] text-sm">Guests: {selectedBooking?.numberOfGuests}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 overflow-hidden border border-[#E5E7EB] rounded-xl">
                    <div className="grid grid-cols-12 bg-[#F9FAFB] px-4 py-2 border-b border-[#E5E7EB] text-[#6B7280] uppercase text-xs font-semibold">
                        <div className="col-span-6">Description</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-2 text-center">Rate</div>
                        <div className="col-span-2 text-right">Amount</div>
                    </div>
                    <div className="grid grid-cols-12 px-4 py-2 text-sm items-center">
                        <p className="col-span-6">Room Charges (Room #{selectedBooking?.roomNumber})</p>
                        <p className="col-span-2 text-center">{calculateNights()}</p>
                        <p className="col-span-2 text-center">₹{Math.floor(selectedBooking?.totalAmount / calculateNights()).toLocaleString("en-IN")}</p>
                        <p className="col-span-2 text-right font-medium">₹{selectedBooking?.totalAmount?.toLocaleString("en-IN")}</p>
                    </div>
                </div>

                <div className="flex justify-end mt-5">
                    <div className="w-full md:w-95">
                        <div className="flex justify-between text-md font-bold">
                            <span>Total</span>
                            <span>₹{selectedBooking?.totalAmount?.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#4B5563]">
                            <span>Paid</span>
                            <span>₹{selectedBooking?.paidAmount?.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#4B5563]">
                            <span>Balance</span>
                            <span>₹{selectedBooking?.pendingAmount?.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-sm text-[#4B5563]">
                    <span className="font-semibold">Payment Method:</span>{" "}{selectedBooking?.paymentMethod || "-"}
                </div>

                <div className="border-t border-dashed border-[#D1D5DB] mt-5 pt-6 flex flex-col md:flex-row items-center gap-6">
                    {/* qr code */}
                    <div className="w-32 h-32 border border-[#D1D5DB] rounded-xl flex items-center justify-center text-[#9CA3AF]">QR Code</div>
                    <div>
                        <h3 className="text-md font-semibold">We value your feedback!</h3>
                        <p className="text-[#6B7280] text-sm">Scan the QR code to rate your stay and share your experience.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Invoice