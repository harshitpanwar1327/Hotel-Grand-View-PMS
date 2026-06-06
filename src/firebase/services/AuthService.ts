import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const firebaseUser = userCredential.user;

    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false,  message: "User profile not found." };
    }

    const userData = userSnap.data();

    if (!userData.isActive) {
      return { success: false, message: "Your account has been disabled. Contact administrator." };
    }

    return {
      success: true,
      data: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: userData.role
      }
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/invalid-credential":
          return { success: false, message: "Invalid email or password." };

        case "firestore/permission-denied":
          return { success: false, message: "You don't have permission to access your profile." };

        default:
          return { success: false, message: error.message };
      }
    }
    return { success: false, message: "Something went wrong." };
  }
}