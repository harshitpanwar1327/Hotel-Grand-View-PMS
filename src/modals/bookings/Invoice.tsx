import { Printer, X } from "lucide-react";
import { type BookingData } from "../../firebase/services/BookingService";
import { useRef } from "react";
import { Timestamp } from "firebase/firestore";
import FeedbackQR from '../../assets/FeedbackQR.png';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceContent from "../../components/InvoiceContent";

interface InvoiceProps {
  setOpenModal: (open: boolean) => void;
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

const Invoice: React.FC<InvoiceProps> = ({ setOpenModal, selectedBooking }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const checkInDate = selectedBooking.checkInAt?.toDate();
  const checkOutDate = selectedBooking.checkOutAt?.toDate();

  const totalDays = (checkInDate && checkOutDate)
    ? Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))) : 1;

  const generatePDF = async (): Promise<Blob> => {
    if (!invoiceRef.current) {
      throw new Error("Invoice not found!");
    }

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfHeight = 297;

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    return pdf.output("blob");
  };

  const handlePrint = async () => {
    const pdfBlob = await generatePDF()
    const url = URL.createObjectURL(pdfBlob)

    const iframe = document.createElement("iframe")
    iframe.style.display = "none"
    iframe.src = url
    document.body.appendChild(iframe)

    iframe.onload = () => {
      iframe.contentWindow?.print()
    }
  }

  return (
    <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center p-4 bg-black/70 z-60' onClick={()=>setOpenModal(false)}>
      <div onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-6 max-h-[90vh] overflow-y-auto bg-[#ffffff] w-full md:w-2/3 lg:w-1/2 rounded-xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#1B2A41] hover:bg-[#1B2A41]/90 shadow-[#1B2A41]/40 hover:shadow-lg text-[#ffffff] text-sm px-4 py-2 rounded-2xl shadow-sm transition duration-300" onClick={handlePrint}>
              <Printer /> <span className="hidden md:inline">Print/Save PDF</span>
            </button>
          </div>
          <X size={18} className="cursor-pointer text-[#6B7280] hover:text-[#000000] hover:scale-105 transition duration-300" onClick={()=>setOpenModal(false)}/>
        </div>

        <hr className="text-[#E5E7EB]" />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold">Hotel Grand View</h1>
              <p className="text-[#6B7280] text-sm max-w-xs">
                Fatehabad Road, Near Taj Mahal, Agra 282001, +91 7017656483
              </p>
            </div>

            <div className="text-left md:text-right">
              <h2 className="uppercase text-lg text-[#6B7280] font-medium">Invoice</h2>
              <p className="text-sm font-bold">{selectedBooking?.bookingId || "-"}</p>
              <p className="text-[#6B7280] text-sm">{formatDate(new Date())}</p>
            </div>
          </div>

          <hr className="text-[#E5E7EB]" />

          <div className="grid md:grid-cols-2 gap-6">
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

          <div className="w-full md:w-1/2 ml-auto">
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

        <div className="absolute -left-9999 top-0">
          <div ref={invoiceRef}>
            <InvoiceContent selectedBooking={selectedBooking} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice