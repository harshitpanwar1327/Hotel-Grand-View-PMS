import type { UserData } from "../../redux/slice/UserSlice";
import { db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";

export const getUserDetails = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, message: "User profile not found." };
    }

    const userData = userSnap.data();

    return {
      success: true,
      data: {
        createdAt: userData.createdAt?.toDate().toISOString() ?? null,
        email: userData.email,
        hotels: userData.hotels ?? [],
        isActive: userData.isActive,
        role: userData.role,
        uid: userData.uid,
        updatedAt: userData.updatedAt?.toDate().toISOString() ?? null
      } as UserData,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch user details." };
  }
}