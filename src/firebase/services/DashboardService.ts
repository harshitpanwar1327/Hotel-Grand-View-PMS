import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "../Firebase";

interface CheckData {
  bookingId: string;
  checkInAt: Timestamp;
  checkOutAt: Timestamp;
  guestName: string;
  paidAmount: number;
  pendingAmount: number;
  phone: string;
  roomNumber: string;
  totalAmount: number;
}

export interface DashboardData {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  todayCheckIns: CheckData[];
  todayCheckOuts: CheckData[];
}

const bookingsRef = collection(db, "bookings");
const roomsRef = collection(db, "rooms");

export const getDashboardData = async () => {
  try {
    const roomsSnapshot = await getDocs(roomsRef);
    const totalRooms = roomsSnapshot.size;

    const availableQuery = query(roomsRef, where("status", "==", "Available"));
    const availableSnapshot = await getDocs(availableQuery);
    const availableRooms = availableSnapshot.size;

    const occupiedQuery = query(roomsRef, where("status", "==", "Occupied"));
    const occupiedSnapshot = await getDocs(occupiedQuery);
    const occupiedRooms = occupiedSnapshot.size;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const todayStartTimestamp = Timestamp.fromDate(startOfDay);
    const todayEndTimestamp = Timestamp.fromDate(endOfDay);

    const checkInQuery = query(bookingsRef,
      where("checkInAt", ">=", todayStartTimestamp),
      where("checkInAt", "<=", todayEndTimestamp)
    );

    const checkInSnapshot = await getDocs(checkInQuery);

    const todayCheckIns: CheckData[] = checkInSnapshot.docs.map((doc) => ({
      bookingId: doc.id,
      ...(doc.data() as CheckData),
    }));

    const checkOutQuery = query(bookingsRef,
      where("checkOutAt", ">=", todayStartTimestamp),
      where("checkOutAt", "<=", todayEndTimestamp)
    );

    const checkOutSnapshot = await getDocs(checkOutQuery);

    const todayCheckOuts: CheckData[] = checkOutSnapshot.docs.map((doc) => ({
      bookingId: doc.id,
      ...(doc.data() as CheckData),
    }));

    const data = {
      totalRooms,
      availableRooms,
      occupiedRooms,
      todayCheckIns,
      todayCheckOuts
    }

    return { success: true, message: 'Dashboard data fetched successfully.', data };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Failed to fetch dashboard data.' };
  }
}