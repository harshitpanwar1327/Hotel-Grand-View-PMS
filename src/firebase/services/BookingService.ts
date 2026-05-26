import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";

export interface BookingData {
  identityNumber: string;
  bookingId?: string;
  bookingStatus: string;
  checkInDate: string;
  checkOutDate: string;
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

const bookingsRef = collection(db, "bookings");

export const addBooking = async (data: Partial<BookingData>) => {
  try {
    const bookingRef = await addDoc(bookingsRef, {
      identityNumber: data.identityNumber,
      bookingStatus: data.bookingStatus,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      createdBy: data.createdBy,
      guestName: data.guestName,
      numberOfGuests: data.numberOfGuests,
      paidAmount: data.paidAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      pendingAmount: data.pendingAmount,
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

export const getBookings = async () => {
  try {
    const bookingQuery = query(
      bookingsRef,
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(bookingQuery);

    const bookings = snapshot.docs.map(doc => ({
      ...doc.data(),
    }));

    return bookings;

  } catch (error) {
    console.log(error);
    throw error;
  }
};