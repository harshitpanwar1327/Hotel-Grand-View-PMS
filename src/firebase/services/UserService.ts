import type { UserDetails } from "../../redux/slice/UserSlice";
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
        createAt: userData.createAt,
        email: userData.email,
        hotelIds: userData.hotelIds ?? [],
        isActive: userData.isActive,
        role: userData.role,
        uid: userData.uid,
        updatedAt: userData.updatedAt
      } as UserDetails,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch user details." };
  }
}