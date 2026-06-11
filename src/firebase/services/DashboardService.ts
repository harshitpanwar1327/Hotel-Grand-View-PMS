import { collection, getDocs, query, QueryConstraint, Timestamp, where } from "firebase/firestore";
import { db } from "../Firebase";

interface CheckData {
  bookingId: string;
  checkInAt: Timestamp;
  checkOutAt: Timestamp;
  checkedOutAt: Timestamp;
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

export const getDashboardData = async (hotelId: string) => {
  try {
    const constraints: QueryConstraint[] = [];
    
    if (hotelId) {
      constraints.push(where("hotelId", "==", hotelId));
    }
  
    const totalRoomsSnapshot = await getDocs(query(roomsRef, ...constraints));
    const totalRooms = totalRoomsSnapshot.size;

    const availableRoomsSnapshot = await getDocs(
      query(roomsRef, ...constraints, where("status", "==", "Available"))
    );
    const availableRooms = availableRoomsSnapshot.size;

    const occupiedRoomsSnapshot = await getDocs(
      query(roomsRef, ...constraints, where("status", "==", "Occupied"))
    );
    const occupiedRooms = occupiedRoomsSnapshot.size;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayStartTimestamp = Timestamp.fromDate(startOfDay);
    const todayEndTimestamp = Timestamp.fromDate(endOfDay);

    const checkInQuery = query(
      bookingsRef, ...constraints,
      where("checkInAt", ">=", todayStartTimestamp),
      where("checkInAt", "<=", todayEndTimestamp)
    );

    const checkInSnapshot = await getDocs(checkInQuery);

    const todayCheckIns: CheckData[] = checkInSnapshot.docs.map((doc) => ({
      bookingId: doc.id,
      ...(doc.data() as CheckData),
    }));

    const checkOutQuery = query(
      bookingsRef, ...constraints,
      where("checkedOutAt", ">=", todayStartTimestamp),
      where("checkedOutAt", "<=", todayEndTimestamp)
    );

    const checkOutSnapshot = await getDocs(checkOutQuery);

    const todayCheckOuts: CheckData[] = checkOutSnapshot.docs.map((doc) => ({
      bookingId: doc.id,
      ...(doc.data() as CheckData),
    }));

    const data: DashboardData = {
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