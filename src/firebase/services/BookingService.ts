import { addDoc, collection, doc, getDocs, orderBy, query, QueryConstraint, runTransaction, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../Firebase";
import type { BookingData, FetchBookingsPayload } from "../../redux/slice/BookingSlice";

const bookingsRef = collection(db, "bookings");
const roomsRef = collection(db, 'rooms');
const email = sessionStorage.getItem('userEmail');

export const addBooking = async (data: Partial<BookingData>) => {
  try {
    const totalAmount = data.totalAmount || 0;
    const paidAmount = data.paidAmount || 0;

    const pendingAmount = totalAmount - paidAmount;

    const checkInAt = new Date();
    const checkOutAt = new Date(data.checkOutAt!);
    checkOutAt.setHours(11, 0, 0, 0);

    await addDoc(bookingsRef, {
      aadharNumber: data.aadharNumber,
      bookingStatus: 'Active',
      checkInAt: Timestamp.fromDate(checkInAt),
      checkOutAt: Timestamp.fromDate(checkOutAt),
      createdBy: email,
      guestName: data.guestName,
      hotelId: data.hotelId,
      numberOfGuests: data.numberOfGuests,
      paidAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: pendingAmount <= 0 ? 'Paid' : 'Partial',
      pendingAmount,
      phone: data.phone,
      roomId: data.roomId,
      roomNumber: data.roomNumber,
      totalAmount,
      createdAt: serverTimestamp()
    });

    await updateDoc(doc(roomsRef, data.roomId), {
      status: "Occupied",
    });

    return { success: true, message: "Booking added successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to add booking." };
  }
}

export const getBookings = async (filters?: FetchBookingsPayload) => {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters?.hotelId) {
      constraints.push(where("hotelId", "==", filters.hotelId));
    }

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
        where("checkInAt", "<=", endTimestamp),
        where("checkOutAt", ">=", startTimestamp)
      );
    }

    constraints.push(orderBy("createdAt", "desc"));

    const bookingQuery = query(bookingsRef, ...constraints);

    const snapshot = await getDocs(bookingQuery);

    const bookings = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        bookingId: doc.id,
        ...data,
        checkInAt: data.checkInAt?.toDate().toISOString(),
        checkOutAt: data.checkOutAt?.toDate().toISOString(),
        checkedOutAt: data.checkedOutAt?.toDate().toISOString() ?? null,
        createdAt: data.createdAt?.toDate().toISOString() ?? null,
        updatedAt: data.updatedAt?.toDate().toISOString() ?? null,
      }
    });

    return { success: true, message: "Bookings fetched successfully.", data: bookings };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch bookings." };
  }
};

export const checkOut = async (bookingId: string, roomId: string, previousPaidAmount: number, previousPendingAmount: number, collectedAmount: number, paymentMethod: string) => {
  try {
    if (!bookingId || !roomId) {
      return { success: false, message: "Invalid booking or room." };
    }

    if (collectedAmount < 0) {
      return { success: false, message: "Collected amount cannot be negative." };
    }

    const bookingRef = doc(bookingsRef, bookingId);
    const roomRef = doc(roomsRef, roomId);

    await runTransaction(db, async (transaction) => {
      const bookingSnap = await transaction.get(bookingRef);
      const roomSnap = await transaction.get(roomRef);

      if (!bookingSnap.exists()) {
        return { success: false, message: 'Booking not found.' };
      }

      if (!roomSnap.exists()) {
        return { success: false, message: 'Room not found.' };
      }

      const bookingData = bookingSnap.data();

      if (bookingData.bookingStatus === "Checked Out") {
        return { success: false, message: 'Booking already checked out.' };
      }

      const updatedPaidAmount = previousPaidAmount + collectedAmount;
      const updatedPendingAmount = Math.max(0, previousPendingAmount - collectedAmount);

      transaction.update(bookingRef, {
        paidAmount: updatedPaidAmount,
        pendingAmount: updatedPendingAmount,
        paymentMethod,
        paymentStatus: updatedPendingAmount <= 0 ? "Paid" : "Partial",
        bookingStatus: "Checked Out",
        checkedOutAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      transaction.update(roomRef, {
        status: "Available",
        updatedAt: serverTimestamp(),
      });
    });

    return { success: true, message: "Checkout successful." };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to checkout." };
  }
}