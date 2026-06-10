import { addDoc, collection, serverTimestamp, query, where, getDocs, updateDoc, doc, orderBy, deleteDoc, QueryConstraint } from "firebase/firestore";
import { db } from "../Firebase";
import type { RoomData } from "../../redux/slice/RoomSlice";

const roomsRef = collection(db, "rooms");

export const addRoom = async (data: RoomData) => {
  try {
    const roomsQuery = query(
      roomsRef,
      where("roomNumber", "==", data.roomNumber)
    );

    const roomsSnapshot = await getDocs(roomsQuery);

    if (!roomsSnapshot.empty) {
      return { success: false, message: "Room number already exist." };
    }

    await addDoc(roomsRef, {
      createdAt: serverTimestamp(),
      hotelId: data.hotelId,
      pricePerNight: data.pricePerNight,
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      status: data.status,
      updatedAt: serverTimestamp()
    });

    return { success: true, message: "Room added successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to add room." };
  }
};

export const getRooms = async (status?: string, hotelId?: string) => {
  try {
    const constraints: QueryConstraint[] = [];

    if (hotelId) {
      constraints.push(where("hotelId", "==", hotelId));
    }

    if (status && status !== "All") {
      constraints.push(where("status", "==", status));
    }

    constraints.push(orderBy("roomNumber", "asc"));

    const roomQuery = query(roomsRef, ...constraints);

    const snapshot = await getDocs(roomQuery);

    const rooms = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        roomId: doc.id,
        ...doc.data(),
        createdAt: data.createdAt?.toDate().toISOString() ?? null,
        updatedAt: data.updatedAt?.toDate().toISOString() ?? null,
      }
    });

    return { success: true, message: "Rooms fetched successfully.", data: rooms };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch rooms." };
  }
};

export const updateRoom = async (data: RoomData) => {
  try {
    const duplicateQuery = query(
      roomsRef,
      where("roomNumber", "==", data.roomNumber.trim())
    );
    
    const duplicateSnapshot = await getDocs(duplicateQuery);
    
    const duplicateExists = duplicateSnapshot.docs.some(doc => doc.id !== data.roomId);
    if (duplicateExists) {
      return { success: false, message: "Room number already exists." };
    }

    const roomRef = doc(roomsRef, data.roomId);

    await updateDoc(roomRef, {
      pricePerNight: data.pricePerNight,
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      status: data.status,
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: "Room updated successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to update room." };
  }
};

export const deleteRoom = async (roomId: string) => {
  try {
    await deleteDoc(doc(roomsRef, roomId));

    return { success: true, message: "Room delete successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to delete room." };
  }
};