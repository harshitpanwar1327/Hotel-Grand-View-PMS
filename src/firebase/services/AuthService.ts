import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const firebaseUser = userCredential.user;

    const userRef = doc(db, "users", firebaseUser.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error("User document not found!");
    }

    const userData = userSnap.data();

    return { uid: firebaseUser.uid, email: firebaseUser.email, role: userData.role }
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}