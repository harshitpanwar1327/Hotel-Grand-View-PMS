import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../Firebase";
import type { HotelData } from "../../redux/slice/HotelSlice";

const usersRef = collection(db, "users");
const hotelsRef = collection(db, "hotels");

export const addHotel = async (data: HotelData) => {
  try {
    const hotelsQuery = query(
      hotelsRef,
      where("hotelName", "==", data.hotelName.trim())
    );

    const hotelsSnapshot = await getDocs(hotelsQuery);
    
    if (!hotelsSnapshot.empty) {
      return { success: false, message: "Hotel name already exist." };
    }

    const hotelDoc = await addDoc(hotelsRef, {
      address: data.address,
      createdAt: serverTimestamp(),
      hotelName: data.hotelName.trim(),
      phone: data.phone,
      updatedAt: serverTimestamp()
    });

    const userRef = doc(usersRef, data.uid);

    await updateDoc(userRef, {
      hotels: arrayUnion({
        hotelId: hotelDoc.id,
        hotelName: data.hotelName.trim()
      }),
      updatedAt: serverTimestamp()
    });

    return { success: true, message: "Hotel added successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to add hotel." };
  }
}

export const getHotels = async () => {
  try {
    const hotelsQuery = query(hotelsRef, orderBy("hotelName", "asc"));
    
    const snapshot = await getDocs(hotelsQuery);

    const hotels = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        hotelId: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() ?? null,
        updatedAt: data.updatedAt?.toDate().toISOString() ?? null,
      };
    });

    return { success: true, message: "Hotels fetched successfully.", data: hotels };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch hotels." };
  }
}

export const updateHotel = async (data: HotelData) => {
  try {
    const duplicateQuery = query(
      hotelsRef,
      where("hotelName", "==", data.hotelName.trim())
    );

    const duplicateSnapshot = await getDocs(duplicateQuery);

    const duplicateExists = duplicateSnapshot.docs.some(doc => doc.id !== data.hotelId);
    if (duplicateExists) {
      return { success: false, message: "Hotel name already exists." };
    }

    const hotelRef = doc(hotelsRef, data.hotelId);

    await updateDoc(hotelRef, {
      hotelName: data.hotelName.trim(),
      address: data.address,
      phone: data.phone,
      updatedAt: serverTimestamp(),
    });

    const usersSnapshot = await getDocs(usersRef);

    const updatePromises = usersSnapshot.docs.map(async (userDoc) => {
      const userData = userDoc.data();

      if (!Array.isArray(userData.hotels)) return;

      const hotelExists = userData.hotels.some((hotel) => hotel.hotelId === data.hotelId);

      if (!hotelExists) return;

      const updatedHotels = userData.hotels.map((hotel) =>
        hotel.hotelId === data.hotelId ? {...hotel, hotelName: data.hotelName.trim()} : hotel
      );

      await updateDoc(userDoc.ref, {
        hotels: updatedHotels,
        updatedAt: serverTimestamp(),
      });
    });

    await Promise.all(updatePromises);


    return { success: true, message: "Hotel updated successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to update hotel." };
  }
}

export const deleteHotel = async (hotelId: string) => {
  try {
    const usersSnapshot = await getDocs(usersRef);

    const userUpdatePromises = usersSnapshot.docs.map(async (userDoc) => {
      const userData = userDoc.data();

      if (!Array.isArray(userData.hotels)) return;

      const updatedHotels = userData.hotels.filter((hotel) => hotel.hotelId !== hotelId);

      if (updatedHotels.length === userData.hotels.length) return;

      await updateDoc(userDoc.ref, {
        hotels: updatedHotels,
        updatedAt: serverTimestamp(),
      });
    });

    await Promise.all(userUpdatePromises);

    const roomsQuery = query(
      collection(db, "rooms"),
      where("hotelId", "==", hotelId)
    );

    const roomsSnapshot = await getDocs(roomsQuery);

    const roomDeletePromises = roomsSnapshot.docs.map((room) =>
      deleteDoc(room.ref)
    );

    await Promise.all(roomDeletePromises);

    await deleteDoc(doc(hotelsRef, hotelId));

    return { success: true, message: "Hotel deleted successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to delete hotel." };
  }
};