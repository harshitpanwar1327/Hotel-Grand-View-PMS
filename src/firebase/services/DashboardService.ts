import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "../Firebase";
import type { BookingData } from "../../redux/slice/BookingSlice";

export interface DashboardData {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  todayCheckIns: BookingData[];
  todayCheckOuts: BookingData[];
}

const bookingsRef = collection(db, "bookings");
const roomsRef = collection(db, "rooms");

export const getDashboardData = async (): Promise<DashboardData> => {
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

    // TODAY CHECK-INS
    const checkInQuery = query(bookingsRef,
      where("checkInAt", ">=", todayStartTimestamp),
      where("checkInAt", "<=", todayEndTimestamp)
    );

    const checkInSnapshot = await getDocs(checkInQuery);

    const todayCheckIns: BookingData[] = checkInSnapshot.docs.map((doc) => ({ ...(doc.data() as BookingData) }));

    // TODAY CHECK-OUTS
    const checkOutQuery = query(bookingsRef,
      where("checkOutAt", ">=", todayStartTimestamp),
      where("checkOutAt", "<=", todayEndTimestamp)
    );

    const checkOutSnapshot = await getDocs(checkOutQuery);

    const todayCheckOuts: BookingData[] = checkOutSnapshot.docs.map((doc) => ({ ...(doc.data() as BookingData) }));

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      todayCheckIns,
      todayCheckOuts
    }

  } catch (error) {
    console.log(error);
    throw error;
  }
}