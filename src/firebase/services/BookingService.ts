import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../Firebase";

export interface BookingData {
  identityNumber: string;
  bookingId: string;
  bookingStatus: string;
  checkInAt: Timestamp;
  checkOutAt: Timestamp;
  createdBy: string;
  guestName: string;
  numberOfGuests: number;
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  pendingAmount: number;
  phone: string;
  roomId: string;
  totalAmount: number;
}

interface FilterOptions {
  status: string;
  date: string;
}

const bookingsRef = collection(db, "bookings");
const email = sessionStorage.getItem('userEmail');

export const addBooking = async (data: Partial<BookingData>) => {
  try {
    const bookingRef = await addDoc(bookingsRef, {
      identityNumber: data.identityNumber,
      bookingStatus: 'Active',
      checkInAt: data.checkInAt,
      checkOutAt: data.checkOutAt,
      createdBy: email,
      guestName: data.guestName,
      numberOfGuests: data.numberOfGuests,
      paidAmount: data.paidAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: (data.totalAmount - data.paidAmount) === 0 ? 'Paid' : 'Partial',
      pendingAmount: data.totalAmount - data.paidAmount,
      phone: data.phone,
      roomId: data.roomId,
      totalAmount: data.totalAmount,
      createdAt: serverTimestamp()
    });

    await updateDoc(doc(db, "bookings", bookingRef.id), {
      bookingId: bookingRef.id,
    });

    return bookingRef.id;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getBookings = async (filters?: FilterOptions) => {
  try {
    const bookingQuery = query(bookingsRef, orderBy("createdAt", "desc"));

    const constraints: any[] = [];

    if (filters?.status && filters.status !== "All") {
      constraints.push(where("bookingStatus", "==", filters.status));
    }

    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);

      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);
      
      constraints.push(
        where("checkInAt", ">=", startTimestamp),
        where("checkInAt", "<=", endTimestamp)
      );
    }

    const snapshot = await getDocs(bookingQuery);

    const bookings = snapshot.docs.map((doc) => ({
      ...(doc.data() as BookingData),
    }));

    return bookings;

  } catch (error) {
    console.log(error);
    throw error;
  }
};