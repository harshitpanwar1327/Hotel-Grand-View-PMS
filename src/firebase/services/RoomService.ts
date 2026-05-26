import { addDoc, collection, serverTimestamp, query, where, getDocs, updateDoc, doc, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../Firebase";

export interface RoomData {
  pricePerNight: number;
  roomId: string;
  roomNumber: string;
  roomType: string;
  status: string;
}

const roomsRef = collection(db, "rooms");

export const addRoom = async (data: RoomData) => {
  try {
    const roomQuery = query(
      roomsRef,
      where("roomNumber", "==", data.roomNumber)
    );

    const roomSnapshot = await getDocs(roomQuery);

    if (!roomSnapshot.empty) {
      throw new Error("Room number already exists!");
    }

    const roomRef = await addDoc(roomsRef, {
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      pricePerNight: data.pricePerNight,
      status: data.status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "rooms", roomRef.id), {
      roomId: roomRef.id,
    });

    return roomRef.id;

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getRooms = async () => {
  try {
    const roomQuery = query(
      roomsRef,
      orderBy("roomNumber", "asc")
    );

    const snapshot = await getDocs(roomQuery);

    const rooms = snapshot.docs.map(doc => ({
      ...doc.data(),
    }));

    return rooms;

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateRoom = async (roomId: string, updatedData: Partial<RoomData>) => {
  try {
    const roomDoc = doc(db, "rooms", roomId);

    await updateDoc(roomDoc, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteRoom = async (roomId: string) => {
  try {
    await deleteDoc(doc(db, "rooms", roomId));

  } catch (error) {
    console.log(error);
    throw error;
  }
};