import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";

export interface DashboardData {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
}

// const bookingsRef = collection(db, "bookings");
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

    return {
      totalRooms,
      availableRooms,
      occupiedRooms
    }

  } catch (error) {
    console.log(error);
    throw error;
  }
}